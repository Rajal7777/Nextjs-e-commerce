"use client";

import { insertProductSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDefaultValues } from "@/lib/constants";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "@/components/ui/input";
import {
    useForm,
    Controller,
    useFormState,
    SubmitHandler,
    useWatch,
} from "react-hook-form";
import slugify from "slugify";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { z } from "zod";
import { createProduct, updateProduct } from "@/lib/actions/product-actions";
import { UploadButton } from "@/lib/uploadThing";
import { toast } from "sonner";
import { Card } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

type ProductFormInput = z.input<typeof insertProductSchema>;
type ProductFormValues = z.output<typeof insertProductSchema>;

const ProductForm = ({
    type,
    product,
    productId,
}: {
    type: "create" | "update";
    product?: ProductFormInput;
    productId?: string;
}) => {
    const router = useRouter();

    const { getValues, setValue, handleSubmit, control } = useForm<
        ProductFormInput,
        undefined,
        ProductFormValues
    >({
        resolver: zodResolver(insertProductSchema),
        defaultValues:
            type === "update" ? product ?? productDefaultValues : productDefaultValues,  // ?? ->use product if exists, otherwise use default values
    });

    const { isSubmitting } = useFormState({ control });

    //get the images from  images form field{form state}.
    const images = useWatch({ control, name: "images" }) || [];
    const isFeatured = useWatch({ control, name: "isFeatured" }) || false;
    const banner = useWatch({ control, name: "banner" }) || null;

    const onSubmit: SubmitHandler<ProductFormValues> = async (
        values,
    ) => {
        if (type === "create") {
            const res = await createProduct(values);

            if (!res.success) {
                toast.error(res.message);
            }

            toast.success(res.message);
            router.push("/admin/products");
        }

        //update
        if (type === "update") {
            if (!productId) {
                router.push("/admin/products");
                return;
            }

            const res = await updateProduct({ ...values, id: productId });

            if (!res.success) {
                toast.error(res.message);
            }

            toast.success(res.message);
            router.push("/admin/products");
        }
    };

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
                                setValue("slug", slugify(getValues("name"), { lower: true }));
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
                                <Input
                                    {...field}
                                    id="stock"
                                    placeholder="Enter Stock"
                                    value={typeof field.value === "number" ? field.value : ""}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </div>

            <div className="upload-field flex flex-col md:flex-row gap-4">
                <FieldGroup>
                    <Controller
                        name="images"
                        control={control}
                        render={({ fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="images">Product Images</FieldLabel>
                                <Card>
                                    <div className="flex-start space-x-2 p-2">
                                        {images.map((image: string) => (
                                            <Image
                                                key={image}
                                                src={image}
                                                alt="Product image"
                                                width={80}
                                                height={80}
                                                className="w-20 h-20 object-cover object-center rounded-sm"
                                            />
                                        ))}
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res: { url: string; }[]) => {
                                                setValue("images", [
                                                    ...images,
                                                    ...res.map((r) => r.url),
                                                ]);
                                            }}
                                            onUploadError={(error) => {
                                                alert(`ERROR! ${error.message}`);
                                            }}
                                        />
                                    </div>
                                </Card>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </div>

            <div className="upload-field">
                {/* isFeatured */}
                Featured Product
                <Card className="space-y-2 p-2 mt-2">
                    <FieldGroup >
                        <Controller
                            name="isFeatured"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} >
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        <FieldLabel htmlFor="isFeatured">isFeatured?</FieldLabel>
                                    </div>
                                </Field>
                            )}
                        />
                        {isFeatured && banner && (
                            <Image
                                src={banner}
                                alt='Banner image'
                                width={1920}
                                height={680}
                                className="w-full h-auto object-cover object-center rounded-sm"
                            />
                        )}
                        {isFeatured && !banner && (
                            <UploadButton
                            className="pl-8"
                                endpoint='imageUploader'
                                onClientUploadComplete={(res: { url: string; }[]) => {
                                    setValue('banner', res[0].url);
                                }}
                                onUploadError={(error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                            />
                        )}
                    </FieldGroup>
                </Card>
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
                                <Textarea
                                    {...field}
                                    id="description"
                                    placeholder="Enter product description"
                                />
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
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? "Submitting..."
                        : type === "create"
                            ? "Create Product"
                            : "Update Product"}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
