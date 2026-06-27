import { z } from "zod";
import { insertProductSchema } from "@/lib/constants/validators";

//z.infer<typeof insertProductSchema> -> creates a TypeScript type from the inserProductschema {schema}
//typeof means get the types of this variable and we use '&' to combine the type of schema type and extra added types

/*
typeof insertProductSchema	=>Get the type of a variable
z.infer<> => Convert a Zod schema into a TypeScript type
& => Combine two types
*/

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: number;
    createdAt: Date;
};
