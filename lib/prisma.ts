import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Use the global object to cache a single PrismaClient instance.
// This prevents creating multiple database connections during
// Next.js hot reloads in development.
const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// Create a PostgreSQL adapter using the connection string
// stored in the DATABASE_URL environment variable.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Reuse the existing PrismaClient if it has already been created.
// Otherwise, create a new PrismaClient using the PostgreSQL adapter.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,

    // Optional: Log database queries while developing.
    // Remove or change these logs for production if desired.
    // log: ["query", "warn", "error"],
  });

// In development, save the PrismaClient instance on the global object
// so it survives Next.js Fast Refresh and avoids opening
// multiple database connections.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
