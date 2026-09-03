import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order/order-actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Charts from "./charts";
import VisitorChart from "./visitor-chart";
import { requireAdmin } from "@/lib/actions/auth-guard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminOverViewPage = async () => {
  //safe guard
  await requireAdmin();

  const session = await auth();


  if (session?.user?.role !== "admin") {
    throw new Error("User is not authorized");
  }

  const summary = await getOrderSummary();
 
  return (
    <div className="space-y-4 mt-2">
      <h1 className="h2-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                summary.totalSales._sum.totalPrice?.toString() || 0,
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Sales</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Customers</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts data={{ salesData: summary.salesData }} />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>User Overview Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitorChart
              data={{
                users: summary.usersCount,
                orders: summary.ordersCount,
                products: summary.productsCount,
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BUYER</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {summary.latestSales.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order?.user?.image ? (
                        <Image
                          src={order.user.image}
                          alt={order.user.name || "User"}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {order?.user?.name?.slice(0, 1).toUpperCase() || "U"}
                        </div>
                      )}
                      <span className="truncate">
                        {order?.user?.name ? order.user.name : "Deleted User"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateOnly}
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    <Link href={`/order/${order.id}`}>
                      <span>Details</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminOverViewPage;
