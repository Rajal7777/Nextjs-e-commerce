import { z } from "zod";
import {
  insertCartItemSchema,
  insertProductSchema,
  cartItemSchema,
  shippingAddressSchema
} from "@/lib/constants/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartItemSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
