"use client";

import { insertProductSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDefaultValues } from "@/lib/constants";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "@/components/ui/input";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
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
import {  Trash2 } from "lucide-react";

type ProductFormInput = z.input<typeof insertProductSchema>; //form input type
type ProductFormValues = z.output<typeof insertProductSchema>; //form output type

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

  // <Input, Context, Output>types
  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ProductFormInput, undefined, ProductFormValues>({
    resolver: zodResolver(insertProductSchema),
    defaultValues:
      type === "update"
        ? (product ?? productDefaultValues)
        : productDefaultValues, // ?? ->use product if exists, otherwise use default values
  });

  //get the images from  images form field{form state}.
  const images = useWatch({ control, name: "images" }) || [];
  const isFeatured = useWatch({ control, name: "isFeatured" }) || false;
  const banner = useWatch({ control, name: "banner" }) || null;


  //Delete image from the images array
  const removeImage = (imageToRemove: string) => {
    const updatedImages = images.filter((image) => image !== imageToRemove);

    setValue("images", updatedImages, {
      shouldValidate: true, //validate the field after setting the value
      shouldDirty: true, //tells rhf field is dirty/modified
    });

    toast.success("Image removed successfully!");
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      if (type === "create") {
        const res = await createProduct(values);

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        router.push("/admin/products");
        return;
      }

      //update section

      if (!productId) {
        toast.error("Product ID is missing");
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct({
        ...values,
        id: productId,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push("/admin/products");
    } catch {
      toast.error("An unexpected error occurred. Please try again later.");
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
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={1}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  placeholder="Price"
                  value={String(field.value ?? "")}
                  onChange={(event) => field.onChange(event.target.value)}
                />
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
                  id="stock"
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  placeholder="Enter Stock"
                  value={String(field.value ?? "")}
                  onChange={(event) => field.onChange(event.target.value)}
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
        {/* Images */}
        <FieldGroup>
          <Controller
            name="images"
            control={control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="images">Product Images</FieldLabel>
                <Card>
                  <div className="flex-start space-x-2 p-2">
                    {images.map((image: string, index: number) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative w-20 h-20"
                      >
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover object-center rounded-sm"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          aria-label={`Remove product image ${index + 1}`}
                          className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-300 text-sm font-bold text-white hover:bg-red-400"
                        >
                          <Trash2 aria-hidden="true" width={16} height={16} className="flex items-center" />
                       </button>
                      </div>
                    ))}

                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string; }[]) => {
                        const uploadedImages = res
                          .map((file) => file.url)
                          .filter(Boolean);

                        //case no images uploaded
                        if (uploadedImages.length === 0) {
                          toast.error("No valid images were uploaded.");
                          return;
                        }

                        // Use Set to avoid duplicates & add urls to react-hook-form images field
                        setValue(
                          "images",
                          [...new Set([...images, ...uploadedImages])],
                          {
                            shouldValidate: true, //validate the field after setting the value
                            shouldDirty: true, //tells rhf field is dirty/modified
                          },
                        );

                        toast.success("Images uploaded successfully!");
                      }}
                      onUploadError={(error) => {
                        toast.error(`Image upload failed: ${error.message}`);
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

      {/* isFeatured */}
      <div className="upload-field">
        Featured Product
        <Card className="space-y-2 p-2 mt-2">
          <FieldGroup>
            <Controller
              name="isFeatured"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isFeatured"
                      checked={field.value === true}
                      onCheckedChange={(checked) => {
                        const featured = checked === true;

                        field.onChange(featured);

                        if (!featured) {
                          setValue("banner", null, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }
                      }}
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
                alt="Banner image"
                width={1920}
                height={580}
                className="w-full h-auto object-cover object-center rounded-sm"
              />
            )}

            {isFeatured && !banner && (
              <UploadButton
                className="pl-8"
                endpoint="imageUploader"
                onClientUploadComplete={(res: { url: string; }[]) => {
                  const bannerUrl = res[0]?.url;

                  if (!bannerUrl) {
                    toast.error("No valid banner image was uploaded.");
                    return;
                  }
                  setValue("banner", bannerUrl, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });

                  toast.success("Banner image uploaded successfully!");
                }}

                onUploadError={(error) => {
                  toast.error(error.message);
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
