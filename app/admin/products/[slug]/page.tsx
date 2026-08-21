import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/product-actions";
import ProductForm from "@/components/admin/product-form";
import { insertProductSchema } from "@/lib/validators";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Update Product",
  description: "Update product page",
};

const AdminProductUpdatePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

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
    price: Number(product.price),
  };

  return (
    <div className="space-y-2 max-w-5xl mx-auto">
      <h1 className="h1-bold">Update Product</h1>
      <ProductForm type="update" product={productFormValues} productId={slug} />
    </div>
  );
};

export default AdminProductUpdatePage;
