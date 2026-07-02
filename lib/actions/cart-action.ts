"use server";

import { CartItem } from "@/types";
import { formatError } from "../constants/utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { cartItemSchema } from "../constants/validators";

// Runs when the user clicks "Add to Cart"
export default async function addItemToCart(data: CartItem) {
  try {
    // Get the unique cart ID stored in the visitor's browser cookie.
    // This lets us know which shopping cart belongs to this visitor.
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    // Stop if the visitor doesn't have a cart cookie.
    if (!sessionCartId) {
      throw new Error("Cart session not found.");
    }

    // Check whether the visitor is logged in.
    const session = await auth();

    // If logged in, save their user ID.
    // Otherwise keep it undefined (guest user).
    const userId = session?.user?.id
      ? (session.user.id as string)
      : undefined;

    // Find this user's existing cart (if there is one).
    const cart = await getMyCart();

    // Validate the item the user wants to add.
    // Throws an error if the data is invalid.
    const item = cartItemSchema.parse(data);

    // Make sure the product actually exists in the database.
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });

    // Temporary debugging output while developing.
    console.log({
      sessionCartId,
      userId,
      cart,
      itemRequested: item,
      product,
    });

    // Later, this is where you'll add/update the cart.
    return {
      success: true,
      message: "Item added to cart successfully",
    };
  } catch (error) {
    // Return a friendly error message instead of crashing.
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

  // Logged-in users have a user ID.
  // Guests do not.
  const userId = session?.user?.id
    ? (session.user.id as string)
    : undefined;

  // Logged-in users: find cart by userId.
  // Guest users: find cart by sessionCartId.
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  // No cart found.
  if (!cart) return undefined;

  // Convert Prisma values (like Decimal) into plain JavaScript values
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