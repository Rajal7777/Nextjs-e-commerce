"use server";

//prisma object lets you communicate with database
import { z } from "zod";
import { PAGE_SIZE } from "../../constants";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../../utils";
import { getTotalPages } from "../../pagination";
import { insertProductSchema, updateProductSchema } from "../../validators";
import { notFound } from "next/navigation";
import type { ClientProduct } from "@/types";
import { Prisma } from "../../generated/prisma/client";
import { toClientProduct } from "@/lib/helpers/product";
import { auth } from "@/auth";

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

//Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    // take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  //pass every single product to toClientProduct function to convert it to a client product {rating: stirng -> number}
  return data.map(toClientProduct);
}

//Get product by id
export async function getProductBySlug(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId },
  });
  if (!product) return notFound();

  return convertToPlainObject(product);
}

//Get single product by it's slug
export async function getProductBySLug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug },
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
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              brand: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

  const categoryFilter = category && category !== "all" ? { category } : {};

  const buildPriceFilter = (priceValue?: string): Prisma.ProductWhereInput => {
    if (!priceValue || priceValue === "all") return {};

    if (priceValue.endsWith("+")) {
      const min = Number(priceValue.replace("+", ""));
      if (!Number.isFinite(min)) return {};
      return {
        price: {
          gte: min,
        },
      };
    }

    const [minRaw, maxRaw] = priceValue.split("-");
    const min = Number(minRaw);
    const max = Number(maxRaw);

    if (!Number.isFinite(min) || !Number.isFinite(max)) return {};

    return {
      price: {
        gte: min,
        lte: max,
      },
    };
  };

  const priceFilter: Prisma.ProductWhereInput = buildPriceFilter(price);

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
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to perform this action",
      };
    }

    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
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
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to perform this action",
      };
    }

    const { id, ...updateData } = updateProductSchema.parse(data);

    const currentProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!currentProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("updateProduct failed:", error);

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
