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

//Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

//Get product by id
export async function getProductById(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId },
  });
  if (!product) return notFound();

  return convertToPlainObject({
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
  });
}

//Get single product by it's slug
export async function getProductBySLug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

//Get all products
export async function getAllProducts({
  limit = PAGE_SIZE,
  page,
  query,
  category,
}: {
  limit?: number;
  page: number;
  category: string;
  query: string;
}) {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
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

//create product
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
