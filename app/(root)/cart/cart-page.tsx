"use client";

import { Button } from "@/components/ui/button";
import {
  addItemToCart,
  removeItemFromCart,
  deleteItemsFromCart,
} from "@/lib/actions/cart-actions";
import { Cart } from "@/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import EmptyCart from "./empty-cart";

const CartTable = ({ cart }: { cart?: Cart; }) => {
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const router = useRouter();

  const totalItems = cart?.items.reduce((acc, item) => acc + item.qty, 0) ?? 0;

  const runCartAction = async (
    actionKey: string,
    action: () => Promise<{ success: boolean; message: string; }>,
  ) => {
    setPendingAction(actionKey);
    try {
      const res = await action();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      router.refresh();
    } finally {
      setPendingAction(null);
    }
  };

  const handleDecreaseQty = (productId: string) => {
    runCartAction(`decrease-${productId}`, async () => removeItemFromCart(productId));
  };

  const handleIncreaseQty = (item: Cart["items"][number]) => {
    runCartAction(`increase-${item.productId}`, async () =>
      addItemToCart({ ...item, qty: 1 }),
    );
  };

  const handleRemoveItem = (item: Cart["items"][number]) => {
    runCartAction(`remove-${item.productId}`, async () => deleteItemsFromCart(item));
  };

  const handleCheckout = () => {
    setCheckoutPending(true);
    router.push("/shipping-address");
  };

  return (
    <>
      {!cart || cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <div
                key={item.slug}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <Link
                    href={`/product/${item.slug}`}
                    className="shrink-0 overflow-hidden rounded-xl bg-muted"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={112}
                      height={112}
                      className="h-24 w-24 object-contain bg-white p-1 sm:h-28 sm:w-28"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="line-clamp-1 text-base font-medium hover:underline"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Quantity: {item.qty}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center rounded-md border bg-background">
                        <Button
                          disabled={pendingAction === `decrease-${item.productId}`}
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => handleDecreaseQty(item.productId)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className={`h-8 w-8 rounded-r-none px-0 ${pendingAction === `decrease-${item.productId}` ? "animate-pulse opacity-40 pointer-events-none" : ""
                            }`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="min-w-8 px-2 text-center text-sm font-medium">
                          {item.qty}
                        </span>

                        <Button
                          disabled={pendingAction === `increase-${item.productId}`}
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => handleIncreaseQty(item)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className={`h-8 w-8 rounded-r-none px-0 ${pendingAction === `increase-${item.productId}` ? "animate-pulse opacity-40 pointer-events-none" : ""
                            }`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        disabled={pendingAction === `remove-${item.productId}`}
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        className={`h-8 w-8 rounded-r-none px-0 ${pendingAction === `remove-${item.productId}` ? "animate-pulse opacity-40 pointer-events-none" : ""
                          }`}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground">
                        Unit Price: {formatCurrency(item.price)}
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(Number(item.price) * Number(item.qty))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <h2 className="text-2xl font-semibold">Cart Details</h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(cart.itemsPrice)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax Fee</span>
                  <span>{formatCurrency(cart.taxPrice)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span>{formatCurrency(cart.shippingPrice)}</span>
                </div>

                <div className="border-t pt-3" />

                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(cart.totalPrice)}</span>
                </div>
              </div>

              <Button
                className="mt-6 w-full"
                disabled={checkoutPending || !!pendingAction}
                onClick={handleCheckout}
              >
                {checkoutPending ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default CartTable;