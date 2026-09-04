import Pagination from "@/components/shared/pagination";
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
import { getAllUsers, deleteUser } from "@/lib/actions/user/user-actions";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/actions/auth-guard";

export const metadata: Metadata = {
  title: "Users",
};

const AdminUserPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) => {
  //Authorization Guard
  await requireAdmin();

  const { page = "1", query = "" } = await searchParams;

  // Safe Pagination Parsing
  const parsedPage = Number(page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const users = await getAllUsers({
    page: currentPage,
    query,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>IMAGE</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {formatId(user.id)}
                  </TableCell>
                  <TableCell>
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        unoptimized
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {user.name?.slice(0, 1).toUpperCase() || "U"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.name || "N/A"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Badge variant="default" className="capitalize">
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        User
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/users/${user.id}`}>Edit</Link>
                      </Button>
                      <DeleteDialog id={user.id} action={deleteUser} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      {users.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination page={currentPage} totalPages={users.totalPages} />
        </div>
      )}
    </div>
  );
};

export default AdminUserPage;