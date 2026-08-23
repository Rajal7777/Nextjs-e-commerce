import { getOrderById } from "@/lib/actions/order-actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-detail-table";
import { auth } from "@/auth";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string; }>;
}) => {
  const { id } = await params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  let clientSecret: string | null = null;
  const isStripePayment = order.paymentMethod?.toLowerCase() === "stripe";

  // Create a PaymentIntent only if the order is unpaid
  // and the selected payment method is Stripe.
  if (!order.isPaid && isStripePayment) {
    const stripeSecretKey =
      process.env.STRIPE_SECRET_KEY ||
      process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      throw new Error(
        "Missing STRIPE_SECRET_KEY (or NEXT_PUBLIC_STRIPE_SECRET_KEY fallback).",
      );
    }

    const stripe = new Stripe(stripeSecretKey);



    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice)),
      currency: "jpy",
      metadata: {
        orderId: order.id,
      },
    });

    clientSecret = paymentIntent.client_secret;
  }

  const normalizePaymentResult = (value: unknown) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }

    const result = value as Record<string, unknown>;

    if (
      typeof result.id !== "string" ||
      typeof result.status !== "string" ||
      typeof result.email_address !== "string" ||
      typeof result.pricePaid !== "string"
    ) {
      return null;
    }

    return {
      id: result.id,
      status: result.status,
      email_address: result.email_address,
      pricePaid: result.pricePaid,
    };
  };

  const normalizedPaymentResult = normalizePaymentResult(
    order.paymentResult,
  );

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
        paymentResult: normalizedPaymentResult,
      }}
      stripeClientSecret={clientSecret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "admin" || false}
    />
  );
};

export default OrderDetailsPage;
