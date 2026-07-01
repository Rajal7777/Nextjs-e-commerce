"use server";

//prisma object lets you communicate with database
import { prisma } from "@/lib/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants/utils";

//Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

//Get single product by it's slug
export async function getProductBySLug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
