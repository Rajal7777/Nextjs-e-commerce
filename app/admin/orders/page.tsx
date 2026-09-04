import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/actions/auth-guard";
import { getAllOrders, deleteOrder } from "@/lib/actions/order/order-actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Orders",
};

const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) => {
  //safe guard
  await requireAdmin();

  const { page = "1", query = "" } = await props.searchParams;

  const parsedPage = Number(page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const orders = await getAllOrders({
    page: currentPage,
    limit: 10,
    query,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="h2-bold text-2xl font-bold tracking-tight">
          Order Details
        </h2>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {formatId(order.id)}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    {order.isPaid && order.paidAt ? (
                      <span className="text-green-600 font-medium">
                        {formatDateTime(order.paidAt).dateTime}
                      </span>
                    ) : (
                      <span className="text-destructive font-medium">
                        Not Paid
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered ? (
                      <span className="text-green-600 font-medium">
                        Delivered
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium">
                        Not Delivered
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/order/${order.id}`}>Details</Link>
                      </Button>
                      <DeleteDialog id={order.id} action={deleteOrder} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      {orders.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination page={currentPage} totalPages={orders.totalPages} />
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
