"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarHeart, User } from "lucide-react";

import ReviewForm from "./review-form";
import Rating from "@/components/rating";
import { getAllReviews } from "@/lib/actions/review-actions";
import { formatDateTime } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ReviewListItem = Awaited<
  ReturnType<typeof getAllReviews>
>["data"][number];

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllReviews({ productId });

      if (!response.success) {
        throw new Error(response.message);
      }

      setReviews(response.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load reviews";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const callbackUrl = encodeURIComponent(`/product/${productSlug}`);

  return (
    <div className="space-y-4">
      {isLoading && (
        <p role="status" >
          Loading reviews...
        </p>
      )}

      {!isLoading && error && (
        <div className="space-y-2">
          <p  className="text-destructive">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void fetchReviews()}
            className="text-sm text-blue-500 underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && reviews.length === 0 && (
        <p>No reviews yet.</p>
      )}

      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={fetchReviews}
        />
      ) : (
        <p>
          Please{" "}
          <Link
            href={`/api/auth/signin?callbackUrl=${callbackUrl}`}
            className="text-blue-500 underline"
          >
            sign in
          </Link>{" "}
          to write a review.
        </p>
      )}

      {!isLoading && !error && reviews.length > 0 && (
        <div
          role="list"
          aria-label="Customer reviews"
          className="flex flex-col gap-3"
        >
          {reviews.map((review) => (
            <Card key={review.id} role="listitem">
              <CardHeader>
                <CardTitle>{review.title}</CardTitle>
                <CardDescription>{review.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <Rating value={Number(review.rating)} />

                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    {review.user.name || "Anonymous"}
                  </div>

                  <div className="flex items-center">
                    <CalendarHeart
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    {formatDateTime(review.createdAt).dateTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;