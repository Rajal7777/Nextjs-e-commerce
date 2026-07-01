import { z } from "zod";
import {
  insertCartItemSchema,
  insertProductSchema,
  cartItemSchema,
} from "@/lib/constants/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartItemSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
