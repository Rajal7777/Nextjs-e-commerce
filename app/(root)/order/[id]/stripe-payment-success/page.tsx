import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order-actions";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";


const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY!);

export const metadata: Metadata = {
    title: "Stripe Payment Success",
};

const SuccessPage = async (props: {
    params: Promise<{ id: string; }>;
    searchParams: Promise<{ payment_intent: string; }>;
}) => {
    //get the order id and payment intent from the url params
    const { id } = await props.params;
    const { payment_intent: paymentIntentId } = await props.searchParams;

    //fetch order
    const order = await getOrderById(id);
    if (!order) notFound();

    //retreive the payment intent from stripe to verify the payment status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    //check if the payment intent is successful and the order id matches the payment intent metadata
    if (paymentIntent.metadata.orderId == null ||
        paymentIntent.metadata.orderId !== order.id.toString()
    ) { return notFound(); }

    //check if the payment intent is successful
    const isSucess = paymentIntent.status === "succeeded";

    if (!isSucess) {
        return redirect(`/order/${id}`);
    }

    return (
        <main className="max-w-4xl w-full mx-auto space-y-8">
            <div className="flex flex-col gap-6 items-center">
                <h1>Thank you for your payment!</h1>
                <p>We are now processing your order.</p>
                <Button asChild>
                    <Link href={`/order/${id}`}>View Order Details</Link>
                </Button>

            </div>
        </main>
    );
};

export default SuccessPage;