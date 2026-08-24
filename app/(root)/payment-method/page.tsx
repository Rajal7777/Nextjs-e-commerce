import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user-actions";
import PaymentMethodForm from "./paymentMethod-form";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { redirect } from "next/navigation";

import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Payment page'
};

const PaymentMethodPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect('/sign-in?callbackUrl=%2Fpayment-method');
    }

    const user = await getUserById(userId);

    return (
        <div className="mt-6">
            <CheckoutSteps current={2} />
            <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
        </div>
    );
};

export default PaymentMethodPage;