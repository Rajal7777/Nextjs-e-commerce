import { PrismaClient } from "@/lib/generated/prisma/client";
import {  neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma =new PrismaClient({
  adapter,
});

async function main() {
  const posts = await prisma.product.findMany();
  console.log(posts);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });