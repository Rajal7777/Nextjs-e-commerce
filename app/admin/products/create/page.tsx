import ProductForm from "@/components/admin/product-form";
import { Metadata } from "next";
import { requireAdmin } from "@/lib/actions/auth-guard";


export const metadata: Metadata = {
    title: 'Create Product',
    description: 'Create a new product in the admin panel',
}

const CreateProductPage = async () => {
     //safe guard
      await requireAdmin();
    return ( 
        <>
        <h1 className="h1-bold">Create Product</h1>
        <ProductForm type='create' />
        </>
     );
}
 
export default CreateProductPage;