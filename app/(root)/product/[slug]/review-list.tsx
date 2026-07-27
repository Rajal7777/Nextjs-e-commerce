"use client";
import { toast } from "sonner";
import ReviewForm from "./review-form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllReviews } from "@/lib/actions/review.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarHeart, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/rating";

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

  useEffect(() => {
    const loadReviews = async () => {
      const re = await getAllReviews({ productId });
      setReviews(re.data);
    };

    loadReviews();
  }, [productId]);

  //reload reviews after a new review is submitted
const fetchReviews = async () => {
  try {
    const { data } = await getAllReviews({ productId });

    setReviews(data);
  } catch {
    toast.error("Failed to load reviews");
  }
};

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={fetchReviews}
        />
      ) : (
        <div>
          Please{" "}
          <Link
            href={`/api/auth/signin?callbackUrl=/product/${productSlug}`}
            className="text-blue-500 underline"
          >
            sign in
          </Link>{" "}
          to write a review.
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {review.userId}
                </div>

                <div className="flex items-center">
                  <CalendarHeart className="mr-2 h-4 w-4" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
