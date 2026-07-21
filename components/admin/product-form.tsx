'use client';

import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDefaultValues } from "@/lib/constants";


const ProductForm = ({ type, product, productID }: {
    type: 'create' | 'update',
    product?: Product,
    productID?: string,
}) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(type === 'create' ? insertProductSchema : updateProductSchema
        ),
        defaultValues: product && type === 'update' ? productDefaultValues : undefined,
    });

    return (
        <form action="" className="space-y-8">
            
            <div className="flex flex-col md:flex-row gap-4">
               <p>name</p>
                <p>slug</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
               <p>name</p>
                <p>slug</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
               <p>name</p>
                <p>slug</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
               <p>name</p>
                <p>slug</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
               <p>name</p>
                <p>slug</p>
            </div>
        </form>
    );
};

export default ProductForm;