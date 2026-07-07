"use server";

import { Prisma } from "@prisma/client";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { convertToPlainObject, formatError } from "../utils";
import { cartItemSchema, insertCartItemSchema } from "../validators";
import { roundDecimal } from "../utils";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";

//Calculate price
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundDecimal(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );
 console.log("items", itemsPrice)
  const shippingPrice = roundDecimal(itemsPrice >= 1000 ? 0 : 100);
  const taxPrice = roundDecimal(0.15 * itemsPrice);
  const totalPrice = roundDecimal(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

//ADD TO CART
export async function addItemToCart(data: CartItem) {
  try {
    // Get the unique cart ID stored in the visitor's browser cookie.
    // This lets us know which shopping cart belongs to this visitor.
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    // Stop if the visitor doesn't have a cart cookie.
    //identifier for who's cart
    if (!sessionCartId) {
      throw new Error("Cart session not found.");
    }

    // Check whether the visitor is logged in.
    const session = await auth();

    // If logged in, save their user ID.
    // Otherwise keep it undefined (guest user).
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

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

    if (!product) throw new Error("Product not found");

    if (!cart) {
      //Create new Cart
      const newCart = insertCartItemSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      //Add to database
      await prisma.cart.create({
        data: newCart,
      });

      //Revalidate page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: "Item added to cart successfully",
      };
    } else {
      //check if item already exist in cart
      const existingItem = cart.items.find(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingItem) {
        //check stock
        if (product.stock < existingItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        //Increase the quantity
        existingItem.qty++;
      } else {
        //Item does not exist in cart
        if (product.stock < 1) throw new Error("Out of Stock");

        //add item to cart.items
        cart.items.push(item);
      }

      //Save to db
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existingItem ? "Updated in" : "added to"} cart`,
      };
    }
  } catch (error) {
    // Return a friendly error message instead of crashing.
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//DELETE ITEMS
export async function removeItemsFromCart(data: CartItem) {
  try {
    // Get cart
    const cart = await getMyCart();

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Validate input
    const item = cartItemSchema.parse(data);

    // Find product
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Check if item exists in cart
    const existingItem = cart.items.find(
      (cartItem) => cartItem.productId === item.productId
    );

    if (!existingItem) {
      throw new Error("Item not found in cart");
    }

    // Remove the item completely
    cart.items = cart.items.filter(
      (cartItem) => cartItem.productId !== item.productId
    );

    // Update database
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
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

  // Logged-in users have a user ID.
  // Guests do not.
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Logged-in users: find cart by userId.
  // Guest users: find cart by sessionCartId.
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
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
export async function removeItemFromCart(productId: string) {
  try {
    //check cart cookie
    //add to cart create sessionId
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart session not found");

    //Get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    //Get user cart
    const cart = await getMyCart();

    if (!cart) throw new Error("Cart not found");

    //find item
    const existingItem = (cart.items as CartItem[]).find(
      (cartItem) => cartItem.productId === productId,
    );

    if (!existingItem) throw new Error("Item not found");

    //Incase of only one item
    if (existingItem.qty === 1) {
      //Remove item from cart
      cart.items = (cart.items as CartItem[]).filter(
        (item) => item.productId !== productId,
      );
    } else {
      //Decrease qty
      (cart.items as CartItem[]).find(
        (item) => item.productId === productId,
      )!.qty = existingItem.qty - 1;
    }

    //Save to db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name} ${
        existingItem ? "updated in" : "added to"
      } cart`,
    };
  } catch (error) {
    return { sucess: false, message: formatError(error) };
  }
}
