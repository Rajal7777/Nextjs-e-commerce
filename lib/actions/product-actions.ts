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
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const normalizeFilterValue = (value?: string) => {
    const text = value?.trim() ?? "";
    return text.toLowerCase() === "all" ? "" : text;
  };

  const searchText = normalizeFilterValue(query);
  const categoryText = normalizeFilterValue(category);
  const priceText = normalizeFilterValue(price);
  const ratingText = normalizeFilterValue(rating);
  const sortText = normalizeFilterValue(sort);

  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : PAGE_SIZE;
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  const ratingValue = Number(ratingText);
  const hasRatingFilter = Number.isFinite(ratingValue) && ratingValue > 0;

  const priceFilter = (() => {
    if (!priceText) return {};

    const exactOrMin = Number(priceText);
    if (Number.isFinite(exactOrMin) && exactOrMin >= 0) {
      return { price: { gte: exactOrMin } };
    }

    const boundedRange = priceText.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
    if (boundedRange) {
      const min = Number(boundedRange[1]);
      const max = Number(boundedRange[2]);
      if (Number.isFinite(min) && Number.isFinite(max)) {
        return { price: { gte: min, lte: max } };
      }
    }

    const lowerBound = priceText.match(/^(\d+(?:\.\d+)?)\+$/);
    if (lowerBound) {
      const min = Number(lowerBound[1]);
      if (Number.isFinite(min)) {
        return { price: { gte: min } };
      }
    }

    return {};
  })();

  const orderBy = (() => {
    switch (sortText.toLowerCase()) {
      case "lowest":
        return { price: "asc" as const };
      case "highest":
        return { price: "desc" as const };
      case "rating":
        return { rating: "desc" as const };
      default:
        return { createdAt: "desc" as const };
    }
  })();

  const where = {
    ...(searchText
      ? { name: { contains: searchText, mode: "insensitive" as const } }
      : {}),
    ...(categoryText
      ? { category: { contains: categoryText, mode: "insensitive" as const } }
      : {}),
    ...priceFilter,
    ...(hasRatingFilter ? { rating: { gte: ratingValue } } : {}),
  };

  const data = await prisma.product.findMany({
    where,
    orderBy,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  });

  const dataCount = await prisma.product.count({ where });

  return {
    data: data.map(toClientProduct),
    totalPages: getTotalPages(dataCount, safeLimit),
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
