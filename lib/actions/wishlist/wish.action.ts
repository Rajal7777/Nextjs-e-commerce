import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { revalidatePath } from "next/cache";


//get productIds from the logged in user's wishlist
export async function getWishlistIds() {
  //is user logged in
  const session = await auth();

  //if not logged in return empty array
  if (!session?.user?.id) return [];

  const rows = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      productId: true,
    },
  });

  return rows.map((x) => x.productId);
}

//get wishlist products for the logged in user
export async function getWishlistProducts() {
  const session = await auth();

  if (!session?.user?.id) throw new Error("You must be signed in.");

  const data = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return convertToPlainObject(data);
}

//check if a poduct is already in the wish list
export async function isInWishList(productId: string) {
  const session = await auth();

  if (!session?.user.id) return false;

  const wishList = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: productId,
      },
    },
  });
  return !!wishList;
}

export async function addToWishList(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User must be signed in.");
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
      select: {
        name: true,
        slug: true,
      },
    });

    if (!product) throw new Error("product not found!");

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

    //revalidate the wishlist page to reflect the changes
    revalidatePath("/wishlist");
    revalidatePath("/search");
    revalidatePath("/");

    //need to update the heart icon on the product page if the user is on that page
    if (product.slug) revalidatePath("/product/" + product.slug);

    return {
      success: true,
      message: `${product.name} added to wishlist`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function removeFromWishList(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("You must be signed in.");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        name: true,
        slug: true,
      },
    });

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });
    revalidatePath("/wishlist");
    revalidatePath("/search");
    revalidatePath("/");

    if (product?.slug) {
      revalidatePath(`/product/${product.slug}`);
    }

    return {
      success: true,
      message: `${product?.name ?? "Item"} removed from wishlist`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//toggle wishlist status of a product
export async function toggleWishlist(productId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return removeFromWishList(productId);
  }

  return addToWishList(productId);
}
