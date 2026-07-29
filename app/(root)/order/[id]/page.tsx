import { getOrderById } from "@/lib/actions/order-actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-detail-table";
import { auth } from "@/auth";
import Stripe from "stripe";

export const metadata: Metadata = {
    title: 'Order Details'
};

const OrderDetailsPage = async ({ params }: { params: Promise<{ id: string; }>; }) => {
    const { id } = await params;

    const order = await getOrderById(id);
    if (!order) notFound();

    const session = await auth();

    let clientSecret: string | null = null;

    // Create a PaymentIntent only if the order is unpaid
    // and the selected payment method is Stripe.
    if (!order.isPaid && order.paymentMethod === "stripe") {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.totalPrice)), // JPY is a zero-decimal currency
            currency: "jpy",
            metadata: {
                orderId: order.id,
            },
        });

        clientSecret = paymentIntent.client_secret;
    }

    return (
        <OrderDetailsTable order={{
            ...order,
            shippingAddress: order.shippingAddress as ShippingAddress,
            
        }}
        stripeClientSecret={clientSecret}
            paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
            isAdmin={session?.user?.role === 'admin' || false}
        />
    );
};

export default OrderDetailsPage;