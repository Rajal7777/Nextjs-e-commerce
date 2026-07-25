'use client';

import { Review } from "@/lib/generated/prisma/browser";
import Link from "next/link";
import { useState } from "react";

const ReviewList = ({
    userId,
    productId,
    productSlug,
}: {
    userId: string;
    productId: string;
    productSlug: string;
}) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    return (
        <div className="space-y-4">
            {reviews.length === 0 && <p>No reviews yet.</p>}
            {userId ? (
                <p>review</p>
            ) : (
                <div>
                    Please{" "}
                    <Link href={`/api/auth/sign-in?callbackUrl=/product/${productSlug}`} className="text-blue-500 underline">
                        sign in
                    </Link>{" "}to write a review.
                </div>
            )}
            <div className="flex flex-col gap-3"></div>
        </div>
    );
};

export default ReviewList;