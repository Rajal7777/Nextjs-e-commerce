import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart/cart-actions";
import { getUserById } from "@/lib/actions/user/user-actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { shippingAdressDefaultValue } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shipping Address",
};
const ShippingAdressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  //in case no user
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/sign-in");
  }

  // Check if user.address exists and is a valid, non-array object
  const hasSavedAddress =
    user.address &&
    typeof user.address === "object" &&
    !Array.isArray(user.address);

  // Safely cast or merge with the fallback layout
  const typedAddress: ShippingAddress = hasSavedAddress
    ? (user.address as ShippingAddress)
    : shippingAdressDefaultValue;

  // Replace: if (user.address)
  if (hasSavedAddress) {
    redirect("/payment-method");
  }

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={typedAddress} />
    </>
  );
};

export default ShippingAdressPage;
