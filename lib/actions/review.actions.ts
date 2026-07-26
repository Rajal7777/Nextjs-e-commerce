"use server";

import { z } from "zod";
import { insertReviewSchema } from "@/lib/validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

//update or create review
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in to submit a review");

    //validate form data & add userId to the data
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user.id,
    });

    //Get product being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error("Product not found");

    //check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    //If existingReview exists, update it, otherwise create a new review
    //if failed Everything rolls back.
    await prisma.$transaction(async (tx) => {
      if (existingReview) {
        //update the current review
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            description: review.description,
            title: review.title,
            rating: review.rating,
          },
        });
      } else {
        //Create review
        await tx.review.create({ data: review });
      }

      //Get the average rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      //Get the number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      //update rating and number of reviewes of the product in product table
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews: numReviews,
        },
      });
    });

    //revalidate the cached data for this page and load the updated data
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Get all reviews for a product  /{data: data}
export async function getAllReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return { data };  
}

//Get a review by userId and productId{get the single current user's review for a product}
export async function getSingleReview({ productId }: { productId: string }) {
  const session = await auth();
  if (!session) throw new Error("User not logged in");

  return await prisma.review.findFirst({
    where: {
      productId: productId,
      userId: session.user.id,
    },
  });
}
