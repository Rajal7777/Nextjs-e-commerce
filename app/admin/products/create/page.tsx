import ProductForm from "@/components/admin/product-form";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Create Product',
    description: 'Create a new product in the admin panel',
}

const CreateProductPage = () => {
    return ( 
        <>
        <h1 className="h1-bold">Create Product</h1>
        <ProductForm type='create' />
        </>
     );
}
 
export default CreateProductPage;