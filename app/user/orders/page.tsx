import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getMyOrders } from "@/lib/actions/order/order-actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Eye,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders",
};

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page } = await searchParams;

  const pageNumber = Number(page);
  const currentPage = pageNumber > 0 ? pageNumber : 1;

  const orders = await getMyOrders({
    page: currentPage,
  });

  return (
    <div className="space-y-6">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Orders
        </h1>

        <p className="text-sm text-muted-foreground">
          View and track all your orders in one place.
        </p>
      </div>

      {/* =========================
          ORDERS CARD
      ========================= */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <ShoppingBag className="size-5" />
            </div>

            <div>
              <CardTitle>Order History</CardTitle>

              <CardDescription>
                {orders.totalPages > 0
                  ? "Here are your recent orders."
                  : "You haven't placed any orders yet."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {orders.data.length > 0 ? (
            <>
              {/* =========================
                  TABLE
              ========================= */}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">
                        Order
                      </TableHead>

                      <TableHead>Date</TableHead>

                      <TableHead>Total</TableHead>

                      <TableHead>Payment</TableHead>

                      <TableHead>Delivery</TableHead>

                      <TableHead className="pr-6 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.data.map((order) => (
                      <TableRow key={order.id}>
                        {/* ORDER ID */}

                        <TableCell className="pl-6">
                          <Link
                            href={`/order/${order.id}`}
                            className="font-mono text-sm font-medium hover:underline"
                          >
                            #{formatId(order.id)}
                          </Link>
                        </TableCell>

                        {/* DATE */}

                        <TableCell>
                          <span className="whitespace-nowrap text-sm text-muted-foreground">
                            {formatDateTime(
                              order.createdAt,
                            ).dateTime}
                          </span>
                        </TableCell>

                        {/* TOTAL */}

                        <TableCell>
                          <span className="font-semibold">
                            {formatCurrency(order.totalPrice)}
                          </span>
                        </TableCell>

                        {/* PAYMENT STATUS */}

                        <TableCell>
                          {order.isPaid && order.paidAt ? (
                            <div className="space-y-1">
                              <Badge
                                variant="secondary"
                                className="gap-1"
                              >
                                <CheckCircle2 className="size-3.5" />
                                Paid
                              </Badge>

                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(
                                  order.paidAt,
                                ).dateTime}
                              </p>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="gap-1"
                            >
                              <Clock3 className="size-3.5" />
                              Unpaid
                            </Badge>
                          )}
                        </TableCell>

                        {/* DELIVERY STATUS */}

                        <TableCell>
                          {order.isDelivered ? (
                            <Badge
                              variant="secondary"
                              className="gap-1"
                            >
                              <PackageCheck className="size-3.5" />
                              Delivered
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="gap-1"
                            >
                              <Clock3 className="size-3.5" />
                              Processing
                            </Badge>
                          )}
                        </TableCell>

                        {/* ACTION */}

                        <TableCell className="pr-6 text-right">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                          >
                            <Link
                              href={`/order/${order.id}`}
                            >
                              <Eye className="mr-2 size-4" />
                              View Order
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* =========================
                  PAGINATION
              ========================= */}

              {orders.totalPages > 1 && (
                <div className="border-t p-4">
                  <Pagination
                    page={currentPage}
                    totalPages={orders.totalPages}
                  />
                </div>
              )}
            </>
          ) : (
            /* =========================
               EMPTY STATE
            ========================= */

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="size-7 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-semibold">
                No orders yet
              </h2>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                You haven&apos;t placed any orders yet. Start
                shopping and your orders will appear here.
              </p>

              <Button asChild className="mt-6">
                <Link href="/">
                  Start Shopping
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;