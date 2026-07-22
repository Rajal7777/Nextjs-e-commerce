import { Metadata } from "next";
import { getProductById } from "@/lib/actions/product-actions";
import notFound from "@/app/not-found";
import ProductForm from "@/components/admin/product-form";
import { insertProductSchema } from "@/lib/validators";
import { z } from "zod";

export const metadata: Metadata = {
    title: "Update Product",
    description: "Update product page",
};

const AdminProductUpdatePage = async (props: {
    params: Promise<{ id: string; }>;
}) => {
    const { id } = await props.params;

    const product = await getProductById(id);

    if (!product) return notFound();

    const productFormValues: z.infer<typeof insertProductSchema> = {
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        images: product.images,
        isFeatured: product.isFeatured,
        banner: product.banner,
        price: String(product.price),
    };

    return (
        <div className="space-y-2 max-w-5xl mx-auto">
            <h1 className="h1-bold">Update Product</h1>
            <ProductForm
                type="update"
                product={productFormValues}
                productId={id}
            />
        </div>
    );
};

export default AdminProductUpdatePage;