"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart, removeItemsFromCart } from "@/lib/actions/cart-actions";
import { Cart, CartItem } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AddToCart = ({
  cart,
  item,
  iconOnly = false,
  disabled = false,
}: {
  cart?: Cart;
  item: CartItem;
  iconOnly?: boolean;
  disabled?: boolean;
}) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsPending(true);
    try {
      const res = await addItemToCart(item);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  // Check if there is item in cart
  const existingItem =
    cart && cart.items.find((i) => i.productId === item.productId);

  //Handle remove from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemsFromCart(item);
    if (res.success) {
      router.refresh();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    return;
  };

  return existingItem ? (
    <div className={`flex items-center ${iconOnly
      ? "absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100"
      : undefined}`}>
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        disabled={disabled || isPending}
        aria-label={`Remove ${item.name} from cart`}
      >
        <Minus />
      </Button>

      <span className="px-2">{existingItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddToCart}
        disabled={disabled || isPending}
        aria-label={`Increase quantity of ${item.name}`}
        className={cn(disabled ? "cursor-not-allowed opacity-50" : "")}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="default"
      onClick={handleAddToCart}
      disabled={disabled || isPending}
      aria-label="Add to cart"
      title={disabled ? "Out of stock" : "Add to cart"}
      className={
        iconOnly
          ? "absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100"
          : undefined
      }
    >
      {iconOnly ? (
        <ShoppingCart className="h-9 w-9 rounded-full sm:h-4 sm:w-4" />
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Add To Cart
        </>
      )}
    </Button>
  );
};

export default AddToCart;
