import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./paymentMethod-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Payment page'
};

const PaymentMethodPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    return (
        <>
            <CheckoutSteps current={2} />
            <PaymentMethodForm prefferedPaymentMethod={user.paymentMethod} />
        </>
    );
};

export default PaymentMethodPage;