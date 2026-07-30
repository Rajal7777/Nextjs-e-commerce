"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SERVER_URL } from "@/lib/constants";

//initialize stripe with the publishable key from the environment variables
//initializing stripe outside of the component to avoid re-initialization on every render use this same instance across the render cycles
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);



//Stripe Form component
const StripeForm = ({ orderId }: { orderId: string; }) => {
  //get the stripe object which helps with payment processing
  const stripe = useStripe();
  //send the payment information to stripe
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  //handle stripe form submission
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!stripe || !elements || !email) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }
    setIsLoading(true);

    //confirmParams is the extra info that you want to send to stripe for processing  the payment and send the user to the return_url after the payment is completed
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-xl">Stripe Checkout</div>
      {errorMessage && <div className="text-destructive">{errorMessage}</div>}
      <PaymentElement />
      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>
      <Button
        className="w-full"
        size="lg"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

const StripePayment = ({
  orderId,
  clientSecret,
}: {
  orderId: string;
  clientSecret: string;
}) => {


  const { theme, systemTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  //to stop hydration errors, we need to wait until the component is mounted before rendering the stripe elements
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading Stripe...
      </div>
    );
  }

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
                ? "stripe"
                : systemTheme === "light"
                  ? "stripe"
                  : "night",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm orderId={orderId} />
    </Elements>
  );
};

export default StripePayment;
