import Pagination from "@/components/shared/pagintaion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order-actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from '@/lib/actions/auth-guard';

export const metadata: Metadata = {
  title: "Customer orders",
};


const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; }>;
}) => {
  await requireAdmin()
  const { page } = await searchParams;
  const pageNumber = Number(page);

  const currentPage = pageNumber > 0 ? pageNumber : 1;

  const orders = await getMyOrders({
    page: currentPage,
  });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Order Details</h2>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "Not Paid"}
                </TableCell>
                <TableCell>
                  {order.isDelivered
                    ? 'order Delivered'
                    : "Not Delivered"}
                </TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                    <span className="px-2">Order-Details</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination btn */}
        {orders.totalPages > 1 && (
          <Pagination page={currentPage} totalPages={orders.totalPages} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
