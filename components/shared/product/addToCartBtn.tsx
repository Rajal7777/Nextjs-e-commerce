"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart-action";
import { Cart, CartItem } from "@/types";
import { Minus, Plus } from "lucide-react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem; }) => {
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

  console.log("existing item", existingItem);

  //Handle remove from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);
    if (res.success) {
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
    <div>
      <Button type="button" variant="default" onClick={handleAddToCart}>
        <Plus className="h-4 w-4" /> Add To Cart
      </Button>
    </div>
  );
};

export default AddToCart;
