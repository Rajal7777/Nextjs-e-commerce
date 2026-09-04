"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
export const removeItemsFromCart = removeItemFromCart;

import { auth } from "@/auth";
import { convertToPlainObject, formatError } from "../../utils";
import { cartItemSchema, insertCartItemSchema } from "../../validators";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { Prisma } from "../../generated/prisma/browser";
import { calcPrice } from "./cart-utils";

//ADD TO CART
export async function addItemToCart(data: CartItem) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    //user must have a session cart or be logged in to add items to the cart
    if (!sessionCartId && !userId) {
      throw new Error("Cart session not found.");
    }

    const item = cartItemSchema.parse(data);

    if (item.qty <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    //get curreent cart
    const cart = await getMyCart();

    // Authorization: a cart must belong to the current user or the current guest session
    if (cart) {
      if (cart.userId && cart.userId !== userId) {
        throw new Error("Unauthorized: Cannot modify another user's cart");
      }

      if (!cart.userId && cart.sessionCartId !== sessionCartId) {
        throw new Error("Unauthorized: Invalid cart session");
      }
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        images: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Server-authoritative price/name/slug/image, never trust client input
    const serverItem: CartItem = {
      ...item,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      image: product.images[0] ?? "",
    };

    if (serverItem.qty > product.stock) {
      throw new Error(`Only ${product.stock} items available`);
    }

    const MAX_RETRIES = 3;

    if (!cart) {
      const newCart = insertCartItemSchema.parse({
        userId,
        items: [serverItem],
        sessionCartId,
        ...calcPrice([serverItem]),
      });

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          await prisma.$transaction(
            async (tx) => {
              // Atomic conditional decrement: the WHERE guard means the row is only
              // touched if enough stock is available, so no lost-update is possible
              // even without an explicit row lock.
              const updatedCount = await tx.$executeRaw`
                UPDATE "Product"
                SET stock = stock - ${serverItem.qty}
                WHERE id = ${product.id} AND stock >= ${serverItem.qty}
              `;

              if (updatedCount === 0) {
                const current = await tx.product.findUnique({
                  where: { id: product.id },
                  select: { stock: true },
                });
                throw new Error(`Only ${current?.stock ?? 0} items available`);
              }

              await tx.cart.create({ data: newCart });
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

      revalidatePath(`/product/${product.slug}`);
      revalidatePath("/cart");
      revalidatePath("/");
      return {
        success: true,
        message: "Item added to cart",
      };
    }

    const currentItems = (cart.items ?? []) as CartItem[];

    const existingItem = currentItems.find(
      (ci) => ci.productId === serverItem.productId,
    );

    // Refresh cached prices for every other item already in the cart so the
    // whole cart reflects current product prices, not just the item being added.
    const otherProductIds = currentItems
      .map((ci) => ci.productId)
      .filter((id) => id !== serverItem.productId);

    const freshProducts = otherProductIds.length
      ? await prisma.product.findMany({
          where: { id: { in: otherProductIds } },
          select: { id: true, price: true },
        })
      : [];
    const freshPriceMap = new Map(
      freshProducts.map((p) => [p.id, p.price.toString()]),
    );

    const refreshedItems = currentItems.map((cartItem) =>
      cartItem.productId === serverItem.productId
        ? cartItem
        : {
            ...cartItem,
            price: freshPriceMap.get(cartItem.productId) ?? cartItem.price,
          },
    );

    const updatedItems = existingItem
      ? refreshedItems.map((cartItem) =>
          cartItem.productId === serverItem.productId
            ? {
                ...cartItem,
                // Use server-authoritative price/data
                name: serverItem.name,
                slug: serverItem.slug,
                price: serverItem.price,
                image: serverItem.image,
                qty: cartItem.qty + serverItem.qty,
              }
            : cartItem,
        )
      : [...refreshedItems, serverItem];

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await prisma.$transaction(
          async (tx) => {
            // Re-verify cart ownership inside the transaction to close any
            // TOCTOU gap between the outer check and this write.
            const ownerFilter = userId
              ? { userId }
              : { sessionCartId, userId: null };

            const lockedCart = await tx.cart.findFirst({
              where: { id: cart.id, ...ownerFilter },
              select: { id: true },
            });

            if (!lockedCart) {
              throw new Error("Cart not found or unauthorized");
            }

            // Atomic conditional decrement: the WHERE guard means the row is only
            // touched if enough stock is available, so no lost-update is possible
            // even without an explicit row lock.
            const updatedCount = await tx.$executeRaw`
              UPDATE "Product"
              SET stock = stock - ${serverItem.qty}
              WHERE id = ${product.id} AND stock >= ${serverItem.qty}
            `;

            if (updatedCount === 0) {
              const current = await tx.product.findUnique({
                where: { id: product.id },
                select: { stock: true },
              });
              throw new Error(`Only ${current?.stock ?? 0} items available`);
            }

            //update cart with new items and recalculate totals
            await tx.cart.update({
              where: { id: cart.id },
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

    revalidatePath(`/product/${product.slug}`);
    revalidatePath("/cart");
    revalidatePath("/");

    return {
      success: true,
      message: `${product.name} ${existingItem ? "updated in" : "added to"} cart`,
    };
  } catch (error) {
    console.error("[Add Item To Cart Error]", error);

    return {
      success: false,
      message: formatError(error),
    };
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

    const cart = await getMyCart();
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Authorization checks
    if (cart.userId && cart.userId !== userId) {
      throw new Error("Unauthorized: Cannot modify another user's cart");
    }

    if (!cart.userId && cart.sessionCartId !== sessionCartId) {
      throw new Error("Unauthorized: Invalid cart session");
    }

    // Find item in cart
    const currentItems = (cart.items ?? []) as CartItem[];

    const existingItem = currentItems.find(
      (cartItem) => cartItem.productId === productId,
    );

    if (!existingItem) {
      throw new Error("Item not found in your cart");
    }

    if (existingItem.qty <= 0) {
      return {
        success: false,
        message: "Item quantity is already zero",
      };
    }

    //Calculate updated items
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
            // Re-verify cart ownership inside the transaction to close any
            // TOCTOU gap between the outer check and this write.
            const ownerFilter = userId
              ? { userId }
              : { sessionCartId, userId: null };

            const lockedCart = await tx.cart.findFirst({
              where: { id: cart.id, ...ownerFilter },
              select: { id: true },
            });

            if (!lockedCart) {
              throw new Error("Cart not found or unauthorized");
            }

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

    //Log for debugging
    console.log(
      `[Cart] ${isRemoved ? "Removed" : "Decreased"} ${product.name} from cart`,
    );

    //Return success response
    return {
      success: true,
      message: isRemoved
        ? `${product.name} removed from cart`
        : `${product.name} quantity decreased`,
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
    //Authentication
    const session = await auth();
    const userId = session?.user?.id;
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("Cart session not found");
    }

    //Get cart with validation
    const cart = await getMyCart();
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Authorization checks
    if (cart.userId && cart.userId !== userId) {
      throw new Error("Unauthorized: Cannot modify another user's cart");
    }

    if (!cart.userId && cart.sessionCartId !== sessionCartId) {
      throw new Error("Unauthorized: Invalid cart session");
    }

    //Validate input
    const item = cartItemSchema.parse(data);

    // Get product with only needed fields
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

    // Find item in cart
    const currentItems = (cart.items ?? []) as CartItem[];

    const existingItem = currentItems.find(
      (cartItem) => cartItem.productId === item.productId,
    );

    if (!existingItem) {
      return {
        success: false,
        message: "Item not found in your cart",
      };
    }

    // Log quantity mismatch if any
    if (item.qty && item.qty !== existingItem.qty) {
      console.warn(
        `[Cart] Quantity mismatch for ${product.name}: ` +
          `Requested ${item.qty}, cart has ${existingItem.qty}. ` +
          `Deleting all ${existingItem.qty} items.`,
      );
    }

    // Calculate updated items
    const updatedItems = currentItems.filter(
      (cartItem) => cartItem.productId !== item.productId,
    );

    //Execute transaction with retry logic
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await prisma.$transaction(
          async (tx) => {
            // Re-verify cart ownership inside the transaction to close any
            // TOCTOU gap between the outer check and this write.
            const ownerFilter = userId
              ? { userId }
              : { sessionCartId, userId: null };

            const lockedCart = await tx.cart.findFirst({
              where: { id: cart.id, ...ownerFilter },
              select: { id: true },
            });

            if (!lockedCart) {
              throw new Error("Cart not found or unauthorized");
            }

            // Lock the product row to prevent race conditions
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
          // Serialize concurrent transactions to prevent race conditions.
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            timeout: 5000,
          },
        );

        break; //exit loop if transaction succeeds
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          throw error;
        }

        // Exponential backoff before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, 100 * Math.pow(2, attempt)),
        );
      }
    }

    //Revalidate paths
    revalidatePath(`/product/${product.slug}`);
    revalidatePath("/cart");
    revalidatePath("/");

    // Return success response
    return {
      success: true,
      message: `${product.name} removed from cart`,
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
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    // Check if the visitor is logged in.
    const session = await auth();

    // Logged-in users have a user ID. Guests do not.
    const userId = session?.user?.id;

    // No session cart and no logged-in user.
    if (!sessionCartId && !userId) {
      return undefined;
    }

    // Logged-in users: find cart by userId.
    // Guests: find cart by sessionCartId.
    const cart = await prisma.cart.findFirst({
      where: userId
        ? { userId }
        : {
            sessionCartId,
            userId: null,
          },
    });

    // No cart found.
    if (!cart) {
      return undefined;
    }

    // Convert Prisma values (like Decimal)
    // into plain JavaScript values.
    return convertToPlainObject({
      ...cart,
      items: cart.items as CartItem[],
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
    });
  } catch (error) {
    console.error("[Get My Cart Error]", error);

    return undefined;
  }
}
