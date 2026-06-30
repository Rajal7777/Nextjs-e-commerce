import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// console.log("DATABASE_URL:primsa.ts", process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

//Prevent multiple databse connections in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
