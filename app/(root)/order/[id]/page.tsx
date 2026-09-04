import { ShippingAddress } from "@/types";
import { getOrderById } from "@/lib/actions/order/order-actions";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OrderDetailsTable from "./order-detail-table";
import { auth } from "@/auth";
import { createStripePaymentIntent } from "@/lib/actions/order/payment-actions";

export const metadata: Metadata = {
  title: "Order Details",
};

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

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string; }>;
}) => {
  const { id } = await params;

  const session = await auth();

  // Redirect to login page if unauthenticated
  if (!session?.user) {
    redirect("/sign-in");
  }

  const isAdmin = session.user.role === "admin";

  const order = await getOrderById(id, {
    userId: session.user.id,
    isAdmin: isAdmin,
  });

  if (!order) notFound();

  // 3. Security Guard: Prevent data exposure across accounts
  const isOwner = order.userId === session.user.id;

  if (!isOwner && !isAdmin) {
    notFound(); // Use notFound instead of "Unauthorized" text to disguise order existence
  }

  let clientSecret: string | null = null;

  if (!order.isPaid && order.paymentMethod?.toLowerCase() === "stripe") {
    const paymentIntentResult = await createStripePaymentIntent(order.id);

    if (paymentIntentResult.success) {
      clientSecret = paymentIntentResult.clientSecret ?? null;
    } else {
      console.error(
        "[Stripe PaymentIntent Exception]:",
        paymentIntentResult.message,
      );
    }
  }

  const normalizedPaymentResult = normalizePaymentResult(order.paymentResult);

  const paypalClientId = process.env.PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    throw new Error("PAYPAL_CLIENT_ID is not configured");
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
        paymentResult: normalizedPaymentResult,
      }}
      stripeClientSecret={clientSecret}
      paypalClientId={paypalClientId}
      isAdmin={isAdmin}
    />
  );
};

export default OrderDetailsPage;
