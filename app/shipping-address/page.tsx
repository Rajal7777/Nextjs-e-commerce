import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart-action";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";


export const metaData: Metadata = {
    title: 'Shipping Address'
}
const ShippingAdressPage = async () => {
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) redirect('/cart');

    const session = await auth();

    //in case no user
    if (!session?.user?.id) {
        redirect('/sign-in');
    }


    const user = await getUserById(session.user.id);

    return (
       <>
       <CheckoutSteps current={1}/>
       <ShippingAddressForm address={user.address as ShippingAddress} />
       </>
    );
};

export default ShippingAdressPage;