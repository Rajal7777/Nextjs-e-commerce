import { z } from "zod";
import { formatNumberWithDecimal } from "../utils";

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
    stock: z.coerce.number(), //stcok will come as a string so convert it into the number
    images: z.array(z.string()).min(1, "Product must have at least one image"),
    isFeatured: z.boolean(),
    banner: z.string().nullable(), //optional value
    price: currency,
});


//Schema for signing users in
export const signInFormSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'password must be at least 6 characters')
});


//Schema for signUp users in
export const signUpFormSchema = z.object({
    name: z.string().min(3, 'Name must be at leat 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'password must be at least 6 characters'),
    confirmPassword: z
        .string()
        .min(6, 'Confirm password must be same as password'),

})
    .refine((data) => data.password === data.confirmPassword, {
        message: "password dont't match",
        path: ['confirmpassword'], //customize the error path
    });