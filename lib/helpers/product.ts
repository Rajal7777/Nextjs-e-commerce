import type { ClientProduct } from "@/types";
import { convertToPlainObject } from "@/lib/utils";

type SerializableProduct = Omit<ClientProduct, "rating" | "createdAt"> & {
  rating: string | number;
  createdAt: string | Date;
};

export function toClientProduct(product: SerializableProduct): ClientProduct {
  const plainProduct = convertToPlainObject(product) as SerializableProduct;

  return {
    ...plainProduct,
    createdAt: String(plainProduct.createdAt),
    rating: Number(plainProduct.rating),
  };
}