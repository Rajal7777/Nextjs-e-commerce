"use client";

import CheckoutSteps from "@/components/shared/checkout-steps";
import { DEFAULT_PAYMENT_METHOD } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

const PaymentMethodForm = ({
  prefferedPaymentMethod,
}: {
  prefferedPaymentMethod: string | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: prefferedPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  return (
    <>
      <CheckoutSteps current={2} />
    </>
  );
};

export default PaymentMethodForm;
