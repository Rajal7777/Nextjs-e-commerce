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
    stock: z.coerce.number(), //stcok will come as a string so convert it into the number
    images: z.array(z.string()).min(1, "Product must have at least one image"),
    isFeateured: z.boolean,
    banner: z.string().nullable(), //optional value
    price: currency,
});
