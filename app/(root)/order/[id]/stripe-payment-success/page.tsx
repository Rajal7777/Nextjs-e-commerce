import { Button } from "@/components/ui/button";
import ConfirmStripePayment from "@/components/shared/confirm-stripe-payment";
import { getOrderById } from "@/lib/actions/order/order-actions";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
import { CheckCircle2, ShoppingBag, Receipt } from "lucide-react";

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY (or NEXT_PUBLIC_STRIPE_SECRET_KEY fallback).",
  );
}

const stripe = new Stripe(stripeSecretKey);

export const metadata: Metadata = {
  title: "Payment Successful",
};

const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  // Fetch order
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  // Retrieve payment intent from Stripe
  const paymentIntent =
    await stripe.paymentIntents.retrieve(paymentIntentId);

  // Verify payment intent belongs to this order
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    notFound();
  }

  // Verify payment succeeded
  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) {
    redirect(`/order/${id}`);
  }

  return (
    <main className="min-h-[70vh] px-4 py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        {/* Success Icon */}
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
          <CheckCircle2 className="size-12 text-green-600 dark:text-green-500" />
        </div>

        {/* Heading */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
            Payment Successful
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Thank you for your payment!
          </h1>

          <p className="mx-auto max-w-lg text-muted-foreground">
            Your payment has been successfully processed. We are now
            preparing your order and will keep you updated.
          </p>
        </div>

        {/* Payment Card */}
        <div className="mt-8 w-full rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Receipt className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Payment Details</h2>
              <p className="text-sm text-muted-foreground">
                Your payment has been confirmed
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Order ID
              </span>

              <span className="max-w-55 truncate font-mono text-sm font-medium">
                #{order.id}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Payment Status
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                <span className="size-1.5 rounded-full bg-green-600" />
                Paid
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Payment Method
              </span>

              <span className="text-sm font-medium">
                Stripe
              </span>
            </div>
          </div>
        </div>

        {/* Confirm Payment */}
        {!order.isPaid && (
          <div className="mt-4 w-full">
            <ConfirmStripePayment
              orderId={order.id}
              paymentResult={{
                id: paymentIntent.id,
                status: paymentIntent.status,
                email_address:
                  paymentIntent.receipt_email || order.user.email,
                pricePaid: String(
                  paymentIntent.amount_received ||
                    paymentIntent.amount,
                ),
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={`/order/${id}`}>
              <Receipt className="mr-2 size-4" />
              View Order Details
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <ShoppingBag className="mr-2 size-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Footer Message */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          A confirmation email will be sent to{" "}
          <span className="font-medium text-foreground">
            {order.user.email}
          </span>
          .
        </p>
      </div>
    </main>
  );
};

export default SuccessPage;