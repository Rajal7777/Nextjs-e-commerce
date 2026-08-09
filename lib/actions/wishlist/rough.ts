"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "@/lib/utils";

export async function getMyWishlistIds() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  });

  return rows.map((x) => x.productId);
}

export async function getMyWishlist() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be signed in.");

  const data = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

export async function isInWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const count = await prisma.wishlist.count({
    where: { userId: session.user.id, productId },
  });

  return count > 0;
}

export async function addToWishlist(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("You must be signed in.");

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, slug: true, name: true },
    });

    if (!product) throw new Error("Product not found");

    await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      create: {
        userId: session.user.id,
        productId,
      },
      update: {},
    });

    revalidatePath("/wishlist");
    revalidatePath("/search");
    revalidatePath("/");

    if (product.slug) revalidatePath("/product/" + product.slug);

    return { success: true, message: product.name + " added to wishlist" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("You must be signed in.");

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true, name: true },
    });

    await prisma.wishlist.deleteMany({
      where: { userId: session.user.id, productId },
    });

    revalidatePath("/wishlist");
    revalidatePath("/search");
    revalidatePath("/");

    if (product?.slug) revalidatePath("/product/" + product.slug);

    return {
      success: true,
      message: (product?.name ?? "Item") + " removed from wishlist",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function toggleWishlist(productId: string) {
  const inWishlist = await isInWishlist(productId);
  if (inWishlist) return removeFromWishlist(productId);
  return addToWishlist(productId);
}
