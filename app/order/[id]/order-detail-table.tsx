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

const OrderDetailsTable = ({ order }: { order: Order }) => {
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
  console.log("date", paidAt);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
