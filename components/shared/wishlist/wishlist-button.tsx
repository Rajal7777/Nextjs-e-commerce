"use client";

import { Heart } from "lucide-react";
import { toggleWishlist } from "@/lib/actions/wishlist/wish.action";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type WishlistButtonProps = {
    productId: string;
    initialIsFavorite: boolean;
};

const WishlistButton = ({
    productId,
    initialIsFavorite,
}: WishlistButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    const handleToggleWishBtn = () => {
        startTransition(async () => {
            const res = await toggleWishlist(productId);

            if (res.success) {
                setIsFavorite((prev) => !prev);
                toast.success(res.message)
            }else{
                toast.error(res.message)
            }
        });
    };

    return (
        <button
            type="button"
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute left-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-colors sm:left-3 sm:top-3 sm:h-9 sm:w-9 ${isFavorite ? "fill-current bg-red-50 text-red-500" : "text-gray-700 hover:bg-red-400"}`}
            disabled={isPending}
            onClick={handleToggleWishBtn}
        >
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
    );
};

export default WishlistButton;
