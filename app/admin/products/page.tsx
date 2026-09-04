import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/actions/auth-guard";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    getAllProducts,
    deleteProductById,
} from "@/lib/actions/product/product-actions";
import { formatCurrency, formatId } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const AdminProductPage = async ({ searchParams }: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>;
}) => {
    await requireAdmin();

    const searchParam = await searchParams;

    const page = Number(searchParam.page) || 1;
    const searchText = searchParam.query || "";
    const category = searchParam.category || "";

    const products = await getAllProducts({
        query: searchText,
        page,
        category,
    });

    return (
        <main className="space-y-2">
            <header className="flex-between">
                <h1>Products</h1>
                <Button asChild>
                    <Link href="/admin/products/create">Create Product</Link>
                </Button>
            </header>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead> ID</TableHead>
                            <TableHead>Product Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{formatId(product.id)}</TableCell>
                                <TableCell>
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        width={50}
                                        height={50}
                                    />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.rating}</TableCell>
                                <TableCell className="flex flex-col gap-1 sm:flex-row">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/products/${product.id}`}>Edit</Link>
                                    </Button>
                                    <DeleteDialog id={product.id} action={deleteProductById} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {products.totalPages > 1 && (
                <Pagination page={page} totalPages={products.totalPages} />
            )}
        </main>
    );
};

export default AdminProductPage;
