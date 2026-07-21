"use client";

import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDefaultValues } from "@/lib/constants";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "@/components/ui/input";
import { useForm, Controller, useFormState, SubmitHandler } from "react-hook-form";
import slugify from "slugify";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {z} from 'zod';
import { createProduct, updateProduct } from "@/lib/actions/product-actions";
import { toast } from "sonner";


const ProductForm = ({
    type,
    product,
    productId,
}: {
    type: "create" | "update";
    product?: Product;
    productId?: string;
}) => {
    const router = useRouter();


    const {
        watch,
        setValue,
        handleSubmit,
        control,
    } = useForm({
        resolver: zodResolver(
            type === "create" ? insertProductSchema : updateProductSchema,
        ),
        defaultValues:
            product && type === "update" ? productDefaultValues : undefined,
    });

    console.log(useFormState({ control }));

   const onSubmit:SubmitHandler<z.infer<typeof insertProductSchema>> = async (values) => {
        if(type === 'create'){
            const res = await createProduct(values);

            if(!res.success){
                toast.error(res.message)
            }

            toast.success(res.message);
            router.push('/admin/products');
        }

        //update
           if(type === 'update'){
            if(!productId) {
                router.push('/admin/products');
                return;
            }

            const res = await updateProduct({...values, id: productId});

            if(!res.success){
                toast.error(res.message)
            }

            toast.success(res.message);
            router.push('/admin/products');
        }
   }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Product name */}
                <FieldGroup>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">Product Name</FieldLabel>
                                <Input {...field} id="name" placeholder="Product Name" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                {/* SLug */}
                <FieldGroup>
                    <div className="relative">
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                                    <Input {...field} id="slug" placeholder="Slug" />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <button
                            type="button"
                            className="bg-gray-600 mt-2 px-2 py-1 rounded text-sm hover:bg-gray-500  text-white"
                            onClick={() => {
                                setValue("slug", slugify(watch("name"), { lower: true }));
                            }}
                        >
                            Generate slug
                        </button>
                    </div>
                </FieldGroup>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* Category */}
                <FieldGroup>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="category">Category</FieldLabel>
                                <Input {...field} id="category" placeholder="Category" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                {/* Brand */}
                <FieldGroup>
                    <Controller
                        name="brand"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="brand">Brand</FieldLabel>
                                <Input {...field} id="brand" placeholder="Enter Brand" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* Price */}
                <FieldGroup>
                    <Controller
                        name="price"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="price">Price</FieldLabel>
                                <Input {...field} id="price" placeholder="Price" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                {/* Stock */}
                <FieldGroup>
                    <Controller
                        name="stock"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                                <Input {...field} id="stock" placeholder="Enter Stock" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </div>

            <div className="upload-field flex flex-col md:flex-row gap-4">

            </div>

            <div className="upload-field">
                {/* isFeatured */}
            </div>

            {/* description  */}
            <div>
                <FieldGroup>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea {...field} id="description" placeholder="Enter product description" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </div>

            {/* Submit button */}
            <div>
                <Button type="submit" disabled={useFormState({ control }).isSubmitting}>
                    {useFormState({ control }).isSubmitting ? "Submitting..." : type === "create" ? "Create Product" : "Update Product"}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
