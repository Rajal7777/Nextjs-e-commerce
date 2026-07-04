import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

//refine() lets you create your own custom validation rule.
//syntax refine(conditon, 'Error message)
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal place",
  );

//Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(), //stock will come as a string so convert it into the number
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(), //optional value
  price: currency,
});

//Schema for signing users
export const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

//Schema for signUp users
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at leat 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be same as password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password dont't match",
    path: ["confirmpassword"], //customize the error path
  });

//Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a non-negative integer"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartItemSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

//Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Name must be at least 3 characters"),
  city: z.string().min(3, "Name must be at least 3 characters"),
  postalCode: z.string().min(3, "Name must be at least 3 characters"),
  country: z.string().min(3, "Name must be at least 3 characters"),
});
