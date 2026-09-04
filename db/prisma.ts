import { PrismaClient } from "@/lib/generated/prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import ws from "ws"; // WebSocket support package

// Choose adapter: prefer Neon when NEON env var is set, otherwise use Postgres adapter.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

type PrismaAdapter = PrismaPg | PrismaNeon;
let adapter: PrismaAdapter;

if (process.env.NEON === "1" || process.env.NEON === "true") {
  neonConfig.webSocketConstructor = ws;
  adapter = new PrismaNeon({ connectionString });
} else {
  adapter = new PrismaPg({ connectionString });
}

// Neon (and other serverless Postgres) pooler connections can be dropped when idle,
// causing "Server has closed the connection" errors. Retry once on these transient errors.
const TRANSIENT_CONNECTION_ERROR_PATTERN =
  /server has closed the connection|connection terminated|econnreset|connection reset/i;

function isTransientConnectionError(error: unknown) {
  if (error instanceof Error) {
    return TRANSIENT_CONNECTION_ERROR_PATTERN.test(error.message);
  }
  return false;
}

// Create and optionally extend the Prisma client
function createPrismaClient() {
  return new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async $allOperations({ query, args }) {
          try {
            return await query(args);
          } catch (error) {
            if (!isTransientConnectionError(error)) {
              throw error;
            }
            // Connection was stale; retry once with a fresh connection from the pool.
            return await query(args);
          }
        },
      },
    },
    result: {
      product: {
        rating: {
          needs: {
            rating: true,
          },
          compute(product) {
            return product.rating.toString();
          },
        },
      },

      cart: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },

        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },

        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },

        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },

      order: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(order) {
            return order.itemsPrice.toString();
          },
        },

        shippingPrice: {
          needs: { shippingPrice: true },
          compute(order) {
            return order.shippingPrice.toString();
          },
        },

        taxPrice: {
          needs: { taxPrice: true },
          compute(order) {
            return order.taxPrice.toString();
          },
        },

        totalPrice: {
          needs: { totalPrice: true },
          compute(order) {
            return order.totalPrice.toString();
          },
        },
      },

      orderItem: {
        price: {
          compute(orderItem) {
            return orderItem.price.toString();
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
