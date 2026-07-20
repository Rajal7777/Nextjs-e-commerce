"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  createPayPalOrder,
  approvePayPalOrder,
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order-actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

//paypal payment
const PayPalStatus = () => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="mb-2 text-sm text-muted-foreground">
        Loading PayPal...
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="mb-2 text-sm text-destructive">Error loading PayPal</div>
    );
  }

  return null;
};

//Button to mark order as paid
const MarkAsPaidButton = ({ orderId }: { orderId: string; }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await updateOrderToPaidCOD(orderId);
          console.log("mark to paid");
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })
      }
    >
      {isPending ? "Processing..." : "Mark To Paid"}
    </Button>
  );
};

//Button to mark order to delivered
const MarkAsDeliveredButton = ({ orderId }: { orderId: string; }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await deliverOrder(orderId);
          console.log("marked to delivered");
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })
      }
    >
      {isPending ? "Processing..." : "Mark to Delivered"}
    </Button>
  );
};

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
}: {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
}) => {
  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast(res.message);
      return undefined;
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string; }) => {
    const res = await approvePayPalOrder(order.id, data);

    toast(res.message);
  };

  // async function handleChange({
  //   btnType,
  //   orderId,
  // }: {
  //   btnType: string;
  //   orderId: string;
  // }) {
  //   console.log('i am form switch');
  //   switch (btnType) {
  //     case "payment":
  //       const res = await updateOrderToPaidCOD(orderId);
  //       if (res.success) {
  //         toast.success(res.message);
  //       } else {
  //         toast.error(res.message);
  //       }
  //       break;

  //     case "address":
  //       const res2 = await deliverOrder(orderId);
  //       if (res2.success) {
  //         toast.success(res2.message);
  //       } else {
  //         toast.error(res2.message);
  //       }
  //       break;
  //   }
  // }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <div className=" col-span-1 md:col-span-2 space-y-4 overflow-x-auto">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-xl pb-4">Payment Method</CardTitle>
              <CardDescription>{paymentMethod}</CardDescription>
              <CardContent>
                {isPaid ? (
                  <Badge variant="secondary">
                    Paid at {formatDateTime(paidAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not paid</Badge>
                )}
              </CardContent>
            </CardHeader>
            <hr />

            <CardContent>
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.postalCode}-
                <span className="capitalize">{shippingAddress.city}</span>,{" "}
                <span className="capitalize">
                  {shippingAddress.streetAddress}
                </span>
                , <span className="capitalize">{shippingAddress.country}</span>
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="secondary">Not Delivered</Badge>
              )}
            </CardContent>

            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-4 space-y-4 gap-4">
              <h2 className="text-xl pb-4">Order Summary</h2>
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>

              {/* Paypal payment */}
              {!isPaid && paymentMethod === "PayPal" && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalStatus />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Cash on delivery */}
            
              {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton orderId={order.id} />
              )}

              {isAdmin && isPaid && !isDelivered && (
                <MarkAsDeliveredButton orderId={order.id} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
