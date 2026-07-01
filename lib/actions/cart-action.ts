"use server";

import { CartItem } from "@/types";

export default async function addItemToCart(data: CartItem) {
  return {
    success: true,
    message: "Item added to cart successfully",
  };
}
