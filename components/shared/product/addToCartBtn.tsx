"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart-actions";
import { Cart, CartItem } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";

const AddToCart = ({
  cart,
  item,
  iconOnly = false,
}: {
  cart?: Cart;
  item: CartItem;
  iconOnly?: boolean;
}) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }

    return res;
  };

  // Check if there is item in cart
  const existingItem =
    cart && cart.items.find((i) => i.productId === item.productId);

  //Handle remove from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);
    if (res.success) {
      router.refresh();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    return;
  };

  return existingItem ? (
    <div className="flex items-center">
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        <Minus />
      </Button>

      <span className="px-2">{existingItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="default"
      onClick={handleAddToCart}
      aria-label="Add to cart"
      title="Add to cart"
      className={
        iconOnly
          ? "absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100"
          : undefined
      }
    >
      {iconOnly ? (
        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
