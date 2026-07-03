import { PrismaClient } from "@/lib/generated/prisma/client";
import { neonConfig } from "@neondatabase/serverless";
//PrismaNeon acts as a bidge between Prisma and Neon Postgress
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws"; //WebSocket support package

//Setup WebScoket connections
//Use the ws package whenever a WebSocket connection is needed.
neonConfig.webSocketConstructor = ws;

// Create a Prisma adapter that connects Prisma to Neon PostgreSQL
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});


//Create a export a Prisma client instance
//prisma returns decimal obj like price and rating so we convert it to string
//destructure product = {price, rating}
function createPrismaClient() {
  return new PrismaClient({
    adapter,
  }).$extends({
    result: {
      product: {
        price: {
          compute({ price }) {
            return price.toString();
          },
        },
        rating: {
          compute({ rating }) {
            return rating.toString();
          },
        },
      },
    },
  });
}

// Type of the extended Prisma client
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

// Store Prisma client globally
const globalForPrisma = globalThis as {
  prisma?: ExtendedPrismaClient;
};

// Reuse existing client or create a new one
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development, save the client to globalThis
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma =prisma;
}
