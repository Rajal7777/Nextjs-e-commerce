import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./paymentMethod-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

import { Metadata } from "next";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";

export const metadata: Metadata = {
    title: 'Payment page'
};

const PaymentMethodPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    const normalizedPaymentMethod =
        PAYMENT_METHODS.includes(user.paymentMethod as any)
            ? user.paymentMethod
            : DEFAULT_PAYMENT_METHOD;
    return (
        <>
            <CheckoutSteps current={2} />
            <PaymentMethodForm prefferedPaymentMethod={normalizedPaymentMethod} />
        </>
    );
};

export default PaymentMethodPage;