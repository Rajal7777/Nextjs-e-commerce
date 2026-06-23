import { Product } from './../lib/generated/prisma/client';
import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";


export type Product = z.infer<typeof insertProductSchema>
