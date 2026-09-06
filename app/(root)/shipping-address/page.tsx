import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart/cart-actions";
import { getUserById } from "@/lib/actions/user/user-actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { shippingAddressDefaultValue } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shipping Address",
};
const ShippingAddressPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/shipping-address");
  }
  // 2. Parallel Fetching for Cart & User Details
  const [cart, user] = await Promise.all([
    getMyCart(),
    getUserById(session.user.id),
  ]);

  //not logged in guard
  if (!user) {
    redirect("/sign-in");
  }

  // Cart Empty Guard
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // Check valid non-array address object
  const hasSavedAddress =
    user.address !== null &&
    typeof user.address === "object" &&
    !Array.isArray(user.address);

  // Safely cast or merge with the fallback layout
  const typedAddress: ShippingAddress = hasSavedAddress
    ? (user.address as ShippingAddress)
    : shippingAddressDefaultValue;

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={typedAddress} />
    </>
  );
};

export default ShippingAddressPage;
