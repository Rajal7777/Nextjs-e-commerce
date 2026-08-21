"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { convertToPlainObject, formatError } from "../utils";
import { cartItemSchema, insertCartItemSchema } from "../validators";
import { calculateConsumptionTax, roundDecimal } from "../utils";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";

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

    if (!sessionCartId) {
      throw new Error("Cart session not found.");
    }

    const session = await auth();
    const userId = session?.user?.id
      ? (session.user.id as string)
      : undefined;

    const cart = await getMyCart();

    //validate data
    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      const newCart = insertCartItemSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.$transaction(async (tx) => {
        const stockUpdate = await tx.product.updateMany({
          where: {
            id: product.id,
            stock: { gte: item.qty },
          },
          data: {
            stock: { decrement: item.qty },
          },
        });

        if (stockUpdate.count === 0) {
          throw new Error("Not enough stock");
        }

        await tx.cart.create({
          data: newCart,
        });
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: "Item added to cart successfully",
      };
    }

    const currentItems = cart.items as CartItem[];
    const existingItem = currentItems.find(
      (cartItem) => cartItem.productId === item.productId,
    );

    const updatedItems = existingItem
      ? currentItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, qty: cartItem.qty + item.qty }
            : cartItem,
        )
      : [...currentItems, item];

    await prisma.$transaction(async (tx) => {
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: product.id,
          stock: { gte: item.qty },
        },
        data: {
          stock: { decrement: item.qty },
        },
      });

      if (stockUpdate.count === 0) {
        throw new Error("Not enough stock");
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: updatedItems,
          ...calcPrice(updatedItems),
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} ${
        existingItem ? "updated in" : "added to"
      } cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//DELETE ITEMS
export async function removeItemsFromCart(data: CartItem) {
  try {
    const cart = await getMyCart();

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const currentItems = cart.items as CartItem[];
    const existingItem = currentItems.find(
      (cartItem) => cartItem.productId === item.productId,
    );

    if (!existingItem) {
      throw new Error("Item not found in cart");
    }

    const updatedItems = currentItems.filter(
      (cartItem) => cartItem.productId !== item.productId,
    );

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            increment: existingItem.qty,
          },
        },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: updatedItems,
          ...calcPrice(updatedItems),
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} removed from cart`,
    };
  } catch (error) {
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

//Delete or remove item from cart
// DECREASE ONE QUANTITY
export async function removeItemFromCart(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const cart = await getMyCart();

    if (!cart) {
      throw new Error("Cart not found");
    }

    const currentItems = cart.items as CartItem[];
    const existingItem = currentItems.find(
      (cartItem) => cartItem.productId === productId,
    );

    if (!existingItem) {
      throw new Error("Item not found");
    }

    const updatedItems =
      existingItem.qty === 1
        ? currentItems.filter((item) => item.productId !== productId)
        : currentItems.map((item) =>
            item.productId === productId
              ? { ...item, qty: item.qty - 1 }
              : item,
          );

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            increment: 1,
          },
        },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: updatedItems,
          ...calcPrice(updatedItems),
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} updated in cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}