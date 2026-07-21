import Pagination from "@/components/shared/pagintaion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllProducts } from "@/lib/actions/product-actions";
import { formatCurrency, formatId, } from "@/lib/utils";
import Link from "next/link";

const AdminProductPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>;
}) => {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || '';
    const category = searchParams.category || '';

    const products = await getAllProducts({
        query: searchText,
        page,
        category,
    });
    console.log(products);
    return (
      <main className="space-y-2">
        <header className="flex-between">
          <h1>products</h1>
          <Button asChild>
            <Link href="/admin/create">Create Product</Link>
          </Button>
        </header>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>actions </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.data.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{formatId(product.id)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                  </Button>
                  {/* Delete */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
   {products.totalPages > 1 && (
    <Pagination page={page} totalPages={products.totalPages} />
   )}

      </main>
    );
};

export default AdminProductPage;