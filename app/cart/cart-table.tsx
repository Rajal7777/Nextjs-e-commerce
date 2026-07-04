"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart-action";
import { Cart } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const [isPending, startTransition] = useTransition();

  const updateQuantity = (
    action: () => Promise<{ success: boolean; message: string }>,
  ) => {
    startTransition(async () => {
      const res = await action();

      if (!res.success) {
        toast.error(res.message);
      }
    });
  };

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty.
          <Link href="/">Go to Shopping page.</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3 mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>SubTotal</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center space-x-4"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="text-gray-500">{item.name}</span>
                      </Link>
                    </TableCell>

                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId,
                            );

                            if (!res.success) {
                              <Button
                                onClick={() => toast(res.message)}
                              ></Button>;
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>

                      <span>{item.qty}</span>

                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);

                            if (!res.success) {
                              <Button
                                onClick={() => toast(res.message)}
                              ></Button>;
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{(item.price * item.qty).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between border-t border-gray-300">
              <span>
                subTotal: ({cart.items.reduce((acc, i) => acc + i.qty, 0)})
              </span>
              <span>{formatCurrency(cart.itemsPrice)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartTable;
