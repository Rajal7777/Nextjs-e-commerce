"use server";

//prisma object lets you communicate with database
import { z } from "zod";
import { PAGE_SIZE } from "./../constants/index";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { getTotalPages } from "../pagination";
import { insertProductSchema, updateProductSchema } from "../validators";
import { notFound } from "next/navigation";
import type { ClientProduct } from "@/types";
import { Prisma } from "../generated/prisma/client";

//types for getAllProducts function
type ProductQueryParams = {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
};

//Product[][number] is the type of a single product record from the database
type ProductRecord = Awaited<
  ReturnType<typeof prisma.product.findMany>
>[number];

type SerializableProduct = Omit<ClientProduct, "rating"> & {
  rating: string | number;
};

//take a product record from the database and convert it to a client product
function toClientProduct(product: ProductRecord): ClientProduct {
  const plainProduct = convertToPlainObject(
    product,
  ) as unknown as SerializableProduct;

  return {
    ...plainProduct,
    rating: Number(plainProduct.rating),
  };
}

//Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  //pass every single product to toClientProduct function to convert it to a client product {rating: stirng -> number}
  return data.map(toClientProduct);
}

//Get product by id
export async function getProductById(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId },
  });
  if (!product) return notFound();

  return convertToPlainObject(product);
}

//Get single product by it's slug
export async function getProductBySLug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

//Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: ProductQueryParams) {
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const categoryFilter = category && category !== "all" ? { category } : {};

  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const ratingFilter =
    rating && rating !== "all" ? { rating: { gte: Number(rating) } } : {};

  const where: Prisma.ProductWhereInput = {
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  };

  const data = await prisma.product.findMany({
    where,
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({ where });

  return {
    data: data.map(toClientProduct),
    totalPages: getTotalPages(dataCount, limit),
  };
}

//Delete product by id
export async function deleteProductById(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//create new product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    //sanitize data
    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Create product successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Update product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const currentProduct = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!currentProduct) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Update product successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });
  return data;
}

//Get featured products
export async function getFeaturedProducts(): Promise<ClientProduct[]> {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return data.map(toClientProduct);
}
