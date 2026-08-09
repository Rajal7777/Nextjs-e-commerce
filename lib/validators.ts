import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";

//refine() lets you create your own custom validation rule.
//syntax refine(conditon, 'Error message)
const yenAmountString = z
  .string()
  .trim()
  .regex(/^\d+$/, "Amount must be a non-negative whole yen value");

const yenAmountNumber = z.coerce
  .number()
  .int("Price must be a whole yen amount")
  .nonnegative("Price must be a non-negative whole yen amount");

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
  price: yenAmountNumber,
});

//Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Product id is required"),
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
  price: yenAmountString,
});

export const insertCartItemSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: yenAmountString,
  totalPrice: yenAmountString,
  shippingPrice: yenAmountString,
  taxPrice: yenAmountString,
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

//Schema for payment method
export const paymentMethodSchema = z.object({
  type: z.string().min(1, "Payment method is required!"),
});

//Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: yenAmountString,
  shippingPrice: yenAmountString,
  taxPrice: yenAmountString,
  totalPrice: yenAmountString,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

//Schema for inserting an order item
export const insertOrderItmeSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: yenAmountString,
  qty: z.number(),
});

//Paypal schema
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

//Update profile Schema
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email().min(3, "Email must be at least 3 charcters"),
});

//update user schema
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "User id is required"),
  role: z.string().min(1, "User role is required"),
});


//Insert review schema
export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  productId: z.string().min(1, "Product id is required"),
  userId: z.string().min(1, "User id is required"),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
})


//wishList schema
export const wishListSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  productId: z.string().min(1, "Product id is required"),
})