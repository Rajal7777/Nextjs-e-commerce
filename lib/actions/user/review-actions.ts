"use server";

import { z } from "zod";
import { insertReviewSchema } from "@/lib/validators";
import { formatError } from "../../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { reviewQuerySchema } from "@/lib/validators";

//update or create review
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("You must be logged in to submit a review");
    }
    //validate form data & add userId
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user.id,
    });

    //check if product exist before creating review
    const product = await prisma.product.findUnique({
      where: { id: review.productId },
      select: { slug: true },
    });

    if (!product) throw new Error("Product not found");

    // Check whether the current user purchased this product.
    const purchasedItem = await prisma.orderItem.findFirst({
      where: {
        productId: review.productId,
        order: {
          userId: session.user.id,
          isPaid: true,
        },
      },
      select: {
        productId: true,
      },
    });

    if (!purchasedItem) {
      throw new Error("You can review this product only after purchasing it");
    }

    //check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
      select: { id: true },
    });

    // Execute atomic isolated transactional updates across tables
    await prisma.$transaction(async (tx) => {
      //update the current review
      if (existingReview) {
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

      //Get the number of reviews {count returns the number of reviews for a product}
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });
      // Avoid trailing decimal precision errors by rounding explicitly
      const rawAvg = averageRating._avg.rating || 0;
      const roundedRating = Math.round(rawAvg * 10) / 10;

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: roundedRating,
          numReviews: numReviews,
        },
      });
    });

    //revalidate the cached data for this page and load the updated data
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: existingReview
        ? "Review updated successfully"
        : "Review submitted successfully",
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
  try {
    //validate productId
    const result = reviewQuerySchema.safeParse({ productId });

    if (!result.success) {
      return {
        success: false,
        message: "Invalid productId",
        data: [],
      };
    }

    //fetch required data from the database
    const data = await prisma.review.findMany({
      where: {
        productId: result.data.productId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return {
      success: true,
      data,
      message: "Reviews fetched successfully",
    };
  } catch (error) {
    console.error("[Get All Reviews Error]", error);

    return {
      success: false,
      message: formatError(error),
      data: [],
    };
  }
}

//Get a review by productId{get the single current user's review for a product}
export async function getSingleReview({ productId }: { productId: string }) {
  try {
    const session = await auth();

    // Safe fallback for unauthenticated views
    if (!session?.user?.id) return null;

    const review = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    return review;
  } catch (error) {
    console.error("[Get Single Review Error]", error);
    return null;
  }
}
