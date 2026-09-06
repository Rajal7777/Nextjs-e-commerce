import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user/user-actions";
import { getMyCart } from "@/lib/actions/cart/cart-actions";

import PaymentMethodForm from "./paymentMethod-form";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { redirect } from "next/navigation";


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment page",
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/sign-in?callbackUrl=/payment-method");
  }

  // Check if the cart is empty and redirect to the cart page if it is.
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    return redirect("/cart");
  }


  

  const user = await getUserById(userId);

  // No shipping address yet -> send the user back to the address step
  const hasAddress =
    user.address !== null &&
    typeof user.address === "object" &&
    !Array.isArray(user.address);

  if (!hasAddress) {
    return redirect("/shipping-address");
  }

  return (
    <div className="mt-6">
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </div>
  );
};

export default PaymentMethodPage;
