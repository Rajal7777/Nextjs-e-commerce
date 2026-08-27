"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { convertToPlainObject, formatError } from "../utils";
import { cartItemSchema, insertCartItemSchema } from "../validators";
import { calculateConsumptionTax, roundDecimal } from "../utils";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { Prisma } from "../generated/prisma/browser";

//Calculate price
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundDecimal(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );
  const shippingPrice = roundDecimal(itemsPrice >= 10000 ? 0 : 500);
  const taxPrice = calculateConsumptionTax(itemsPrice);
  const totalPrice = roundDecimal(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: String(itemsPrice),
    shippingPrice: String(shippingPrice),
    taxPrice: String(taxPrice),
    totalPrice: String(totalPrice),
  };
};

//ADD TO CART
export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found.");

    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);

    if (item.qty <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        name: true,
        slug: true,
        stock: true,
      },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = insertCartItemSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.$transaction(async (tx) => {
        const lockedProduct = await tx.product.findUnique({
          where: { id: product.id },
          select: { id: true, stock: true },
        });

        if (!lockedProduct) {
          throw new Error("Product not found");
        }

        if (lockedProduct.stock < item.qty) {
          throw new Error(`Only ${lockedProduct.stock} items available`);
        }

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.qty } },
        });
        await tx.cart.create({ data: newCart });
      });

      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: "Item added to cart" };
    }

    const currentItems = cart.items as CartItem[];
    const existingItem = currentItems.find(
      (ci) => ci.productId === item.productId,
    );

    const updatedItems = existingItem
      ? currentItems.map((ci) =>
          ci.productId === item.productId
            ? { ...ci, qty: ci.qty + item.qty }
            : ci,
        )
      : [...currentItems, item];

    await prisma.$transaction(async (tx) => {
      const lockedProduct = await tx.product.findUnique({
        where: { id: product.id },
        select: { id: true, stock: true },
      });

      if (!lockedProduct) {
        throw new Error("Product not found");
      }

      if (lockedProduct.stock < item.qty) {
        throw new Error(`Only ${lockedProduct.stock} items available`);
      }

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.qty } },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { items: updatedItems, ...calcPrice(updatedItems) },
      });
    });

    revalidatePath(`/product/${product.slug}`);
    revalidatePath("/cart");
    revalidatePath("/");

    return {
      success: true,
      message: `${product.name} ${existingItem ? "updated in" : "added to"} cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// DECREASE ONE QUANTITY
export async function removeItemFromCart(productId: string) {
  try {
    // 1. Authentication & Authorization
    const session = await auth();
    const userId = session?.user?.id;
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("Cart session not found");
    }

    // 2. Get product with only needed fields
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        stock: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // 3. Get cart with authorization
    const cart = await getMyCart();
    if (!cart) {
      throw new Error("Cart not found");
    }

    // 4. Authorization checks
    if (cart.userId && cart.userId !== userId) {
      throw new Error("Unauthorized: Cannot modify another user's cart");
    }

    if (!cart.userId && cart.sessionCartId !== sessionCartId) {
      throw new Error("Unauthorized: Invalid cart session");
    }

    // 5. Find item in cart
    const currentItems = cart.items as CartItem[];
    const existingItem = currentItems.find(
      (cartItem) => cartItem.productId === productId,
    );

    if (!existingItem) {
      throw new Error("Item not found in your cart");
    }

    if (existingItem.qty <= 0) {
      throw new Error("Invalid quantity");
    }

    // 6. Calculate updated items
    const isRemoved = existingItem.qty === 1;

    const updatedItems = isRemoved
      ? currentItems.filter((item) => item.productId !== productId)
      : currentItems.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty - 1 } : item,
        );

    // 7. Execute transaction with retry logic
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await prisma.$transaction(
          async (tx) => {
            const lockedProduct = await tx.$queryRaw<{ stock: number }[]>`
              SELECT stock
              FROM "Product"
              WHERE id = ${product.id}
              FOR UPDATE
            `;

            if (lockedProduct.length === 0) {
              throw new Error("Product not found");
            }

            await tx.product.update({
              where: {
                id: product.id,
              },
              data: {
                stock: {
                  increment: 1,
                },
              },
            });

            await tx.cart.update({
              where: {
                id: cart.id,
              },
              data: {
                items: updatedItems,
                ...calcPrice(updatedItems),
              },
            });
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            timeout: 5000,
          },
        );

        // Transaction succeeded
        break;
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          throw error;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 100 * Math.pow(2, attempt)),
        );
      }
    }
    //  Revalidate paths
    revalidatePath(`/product/${product.slug}`);
    revalidatePath("/cart");
    revalidatePath("/"); // If cart is shown on homepage

    // 9. Log for debugging
    console.log(
      `[Cart] ${isRemoved ? "Removed" : "Decreased"} ${product.name} from cart`,
    );

    // 10. Return success response
    return {
      success: true,
      message: isRemoved
        ? `${product.name} removed from cart`
        : `${product.name} quantity decreased`,
      data: {
        productId: product.id,
        newQuantity: isRemoved ? 0 : existingItem.qty - 1,
        isRemoved,
      },
    };
  } catch (error) {
    // Log error for debugging
    console.error("[Cart] Error removing item:", error);

    return {
      success: false,
      message: formatError(error),
    };
  }
}

//DELETE ITEMS
export async function deleteItemsFromCart(data: CartItem) {
  try {
    // 1. Authentication & Authorization
    const session = await auth();
    const userId = session?.user?.id;
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("Cart session not found");
    }

    // 2. Get cart with validation
    const cart = await getMyCart();
    if (!cart) {
      throw new Error("Cart not found");
    }

    // 3. Authorization checks
    if (cart.userId && cart.userId !== userId) {
      throw new Error("Unauthorized: Cannot modify another user's cart");
    }

    if (!cart.userId && cart.sessionCartId !== sessionCartId) {
      throw new Error("Unauthorized: Invalid cart session");
    }

    // 4. Validate input
    const item = cartItemSchema.parse(data);

    // 5. Get product with only needed fields
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        name: true,
        slug: true,
        stock: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // 6. Find item in cart
    const currentItems = cart.items as CartItem[];

    const existingItem = currentItems.find(
      (cartItem) => cartItem.productId === item.productId,
    );

    if (!existingItem) {
      throw new Error("Item not found in cart");
    }

    // 7. Log quantity mismatch if any
    if (item.qty && item.qty !== existingItem.qty) {
      console.warn(
        `[Cart] Quantity mismatch for ${product.name}: ` +
          `Requested ${item.qty}, cart has ${existingItem.qty}. ` +
          `Deleting all ${existingItem.qty} items.`,
      );
    }

    // 8. Calculate updated items
    const updatedItems = currentItems.filter(
      (cartItem) => cartItem.productId !== item.productId,
    );

    // 9. Execute transaction with retry logic
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await prisma.$transaction(
          async (tx) => {
            const lockedProduct = await tx.$queryRaw<{ stock: number }[]>`
              SELECT stock
              FROM "Product"
              WHERE id = ${product.id}
              FOR UPDATE
            `;

            if (lockedProduct.length === 0) {
              throw new Error("Product not found");
            }

            await tx.product.update({
              where: {
                id: product.id,
              },
              data: {
                stock: {
                  increment: existingItem.qty,
                },
              },
            });

            await tx.cart.update({
              where: {
                id: cart.id,
              },
              data: {
                items: updatedItems,
                ...calcPrice(updatedItems),
              },
            });
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            timeout: 5000,
          },
        );

        break;
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          throw error;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 100 * Math.pow(2, attempt)),
        );
      }
    }

    // 10. Revalidate paths
    revalidatePath(`/product/${product.slug}`);
    revalidatePath("/cart");
    revalidatePath("/");

    // 11. Log for debugging
    console.log(
      `[Cart] Deleted ${existingItem.qty}x ${product.name} from cart. ` +
        `Remaining items: ${updatedItems.length}`,
    );

    // 12. Return success response
    return {
      success: true,
      message: `${product.name} removed from cart`,
      data: {
        productId: product.id,
        quantityRemoved: existingItem.qty,
        remainingItems: updatedItems.length,
      },
    };
  } catch (error) {
    // Log error for debugging
    console.error("[Cart] Error deleting item:", error);

    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Finds the current user's cart.
export async function getMyCart() {
  // Read the cart ID from the browser cookie.
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("Cart session not found.");
  }

  // Check if the visitor is logged in.
  const session = await auth();

  // Logged-in users have a user ID.Guests do not.
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Logged-in users: find cart by userId.
  // Guests can only access anonymous carts for their session.
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId, userId: null },
  });

  // No cart found.
  if (!cart) return undefined;

  // Convert prisma values (like Decimal) into plain JavaScript values
  // so they can be safely returned to the client.
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
