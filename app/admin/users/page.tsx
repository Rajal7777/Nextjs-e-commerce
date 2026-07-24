import Pagination from "@/components/shared/pagintaion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers, deleteUser } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Display users",
};

const AdminUserPage = async (props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) => {
  const { page = "1", query = "" } = await props.searchParams;

  const users = await getAllUsers({
    page: Number(page),
    query,
  });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Order Details</h2>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "admin" ? (
                    <Badge variant="default">admin</Badge>
                  ) : (
                    <Badge variant="outline">user</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination btn */}
        {users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
