import { PrismaClient } from "@/lib/generated/prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import ws from "ws"; // WebSocket support package

// Choose adapter: prefer Neon when NEON env var is set, otherwise use Postgres adapter.
const connectionString = process.env.DATABASE_URL;

let adapter: any;
if (process.env.NEON === "1" || process.env.NEON === "true") {
  neonConfig.webSocketConstructor = ws;
  adapter = new PrismaNeon({ connectionString });
} else {
  adapter = new PrismaPg({ connectionString });
}

// Create and optionally extend the Prisma client
function createPrismaClient() {
  return new PrismaClient({ adapter }).$extends({
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

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as { prisma?: ExtendedPrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
