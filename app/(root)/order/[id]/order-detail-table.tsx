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
} from "@/lib/actions/order/order-actions";

import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";

import {
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

// PAYPAL STATUS

const PayPalStatus = () => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
        <Clock3 className="size-4 animate-pulse" />
        Loading PayPal...
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
        Unable to load PayPal. Please try again.
      </div>
    );
  }

  return null;
};

// MARK AS PAID

const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className="w-full"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await updateOrderToPaidCOD(orderId);

          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })
      }
    >
      {isPending ? "Processing..." : "Mark as Paid"}
    </Button>
  );
};

// MARK AS DELIVERED
const MarkAsDeliveredButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className="w-full"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await deliverOrder(orderId);

          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })
      }
    >
      {isPending ? "Processing..." : "Mark as Delivered"}
    </Button>
  );
};

// ORDER DETAILS

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
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

  const normalizedPaymentMethod = paymentMethod?.toLowerCase();

  
  
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast.error(res.message);
      return undefined;
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 my-6">
      <div className="space-y-6 lg:col-span-2">
        {/* PAYMENT INFORMATION */}

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="size-5" />
                </div>

                <div>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription className="mt-1">
                    Payment method and status
                  </CardDescription>
                </div>
              </div>

              {isPaid ? (
                <Badge variant="secondary" className="gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  Paid
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1.5">
                  <Clock3 className="size-3.5" />
                  Unpaid
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>

                <p className="mt-1 font-medium">{paymentMethod}</p>
              </div>

              {isPaid && paidAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Paid At</p>

                  <p className="mt-1 font-medium">
                    {formatDateTime(paidAt).dateTime}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SHIPPING INFORMATION */}

        <Card>
          <CardHeader className="border-b">
            <div className="flex gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <MapPin className="size-5" />
              </div>

              <div>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription className="mt-1">
                  Where your order will be delivered
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{shippingAddress.fullName}</p>

              <p className="text-muted-foreground">
                {shippingAddress.streetAddress}
              </p>

              <p className="text-muted-foreground">
                {shippingAddress.postalCode}, {shippingAddress.city}
              </p>

              <p className="text-muted-foreground">{shippingAddress.country}</p>
            </div>

            <div className="mt-5 border-t pt-4">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-muted-foreground" />

                <span className="text-sm text-muted-foreground">
                  Delivery Status
                </span>

                {isDelivered ? (
                  <Badge variant="secondary" className="ml-auto">
                    Delivered
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-auto">
                    Processing
                  </Badge>
                )}
              </div>

              {isDelivered && deliveredAt && (
                <p className="mt-2 text-right text-xs text-muted-foreground">
                  Delivered at {formatDateTime(deliveredAt).dateTime}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ORDER ITEMS */}

        <Card>
          <CardHeader className="border-b">
            <div className="flex gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Package className="size-5" />
              </div>

              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription className="mt-1">
                  {orderItems.length}{" "}
                  {orderItems.length === 1 ? "item" : "items"} in this order
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Product</TableHead>

                    <TableHead className="text-center">Quantity</TableHead>

                    <TableHead className="pr-6 text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell className="pl-6">
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex min-w-55 items-center gap-3 hover:opacity-80"
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>

                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-muted px-2 py-1 text-sm">
                          {item.qty}
                        </span>
                      </TableCell>

                      <TableCell className="pr-6 text-right font-medium">
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}

      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader className="border-b">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order total</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            {/* PRICE BREAKDOWN */}

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>

                <span>{formatCurrency(itemsPrice)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>

                <span>{formatCurrency(taxPrice)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>

                <span>{formatCurrency(shippingPrice)}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>

                <span className="text-xl font-bold">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* PAYMENT ACTIONS   */}

            {!isPaid && normalizedPaymentMethod === "paypal" && (
              <div className="space-y-3 border-t pt-5">
                <div>
                  <h3 className="font-medium">Complete Payment</h3>

                  <p className="text-xs text-muted-foreground">
                    Secure payment powered by PayPal
                  </p>
                </div>

                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: "JPY",
                    intent: "capture",
                  }}
                >
                  <PayPalStatus />

                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {!isPaid &&
              normalizedPaymentMethod === "stripe" &&
              stripeClientSecret && (
                <div className="border-t pt-5">
                  <div className="mb-4">
                    <h3 className="font-medium">Complete Payment</h3>

                    <p className="text-xs text-muted-foreground">
                      Secure payment powered by Stripe
                    </p>
                  </div>

                  <StripePayment
                    orderId={order.id}
                    clientSecret={stripeClientSecret}
                  />
                </div>
              )}

            {/* COD */}

            {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
              <div className="border-t pt-5">
                <p className="mb-3 text-sm text-muted-foreground">
                  Cash on delivery order
                </p>

                <MarkAsPaidButton orderId={order.id} />
              </div>
            )}

            {/* DELIVERY */}

            {isAdmin && isPaid && !isDelivered && (
              <div className="border-t pt-5">
                <p className="mb-3 text-sm text-muted-foreground">
                  Payment received. You can now mark this order as delivered.
                </p>

                <MarkAsDeliveredButton orderId={order.id} />
              </div>
            )}

            {/* COMPLETED */}

            {isPaid && isDelivered && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3 text-sm font-medium">
                <CheckCircle2 className="size-4" />
                Order Completed
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
