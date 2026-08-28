"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { getStripe } from "@/lib/stripe";
import { formatError } from "../../utils";

export async function createStripePaymentIntent(orderId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const stripe = getStripe();

    const result = await prisma.$transaction(async (tx) => {
      const orderRows = await tx.$queryRaw<
        Array<{
          id: string;
          userId: string;
          paymentMethod: string;
          isPaid: boolean;
          totalPrice: string;
          stripePaymentIntentId: string | null;
        }>
      >`
        SELECT "id", "userId", "paymentMethod", "isPaid", "totalPrice", "stripePaymentIntentId"
        FROM "Order"
        WHERE "id" = ${orderId}
        FOR UPDATE
      `;

      const order = orderRows[0];

      if (!order || order.userId !== userId) {
        throw new Error("Order not found");
      }

      if (order.isPaid) {
        throw new Error("Order is already paid");
      }

      if (order.paymentMethod.toLowerCase() !== "stripe") {
        throw new Error("Stripe is not selected for this order");
      }

      if (order.stripePaymentIntentId) {
        const existingIntent = await stripe.paymentIntents.retrieve(
          order.stripePaymentIntentId,
        );

        if (existingIntent.status !== "canceled") {
          return existingIntent;
        }
      }

      const amount = Math.round(Number(order.totalPrice));

      if (!Number.isSafeInteger(amount) || amount <= 0) {
        throw new Error("Invalid order amount");
      }

      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount,
          currency: "jpy",
          metadata: { orderId: order.id },
        },
        {
          idempotencyKey: `order-payment-intent-${order.id}`,
        },
      );

      await tx.order.update({
        where: { id: order.id },
        data: { stripePaymentIntentId: paymentIntent.id },
      });

      return paymentIntent;
    });

    if (!result.client_secret) {
      throw new Error("Stripe did not return a client secret");
    }

    return { success: true, clientSecret: result.client_secret };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
