//liseten to payment with stripe webhook and update the order status to paid if the payment is successful and save the changes in database

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order-actions";

//intialize stripe
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY (or NEXT_PUBLIC_STRIPE_SECRET_KEY fallback).",
  );
}

const stripe = new Stripe(stripeSecretKey);

//POST handler for stripe webhook
export async function POST(req: NextRequest) {
  //construct event using the raw request body, the stripe signature body,webhook secret
  //this will ensure the data is not tampered
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string,
  );

  //charge.succeeded indicates a successful payment
  if (event.type === "charge.succeeded") {
    //retrieve the orderId from the payment metadata
    const { object } = event.data;

    //update the order status to paid
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email!,
        pricePaid: object.amount.toFixed(),
      },
    });

    return NextResponse.json({
      message: "update order to paid was successfull",
    });
  }

  return NextResponse.json({
    message: "event is not charge.succeded",
  });
}
