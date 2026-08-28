"use client";

import { useEffect, useRef } from "react";
import { confirmStripeOrderPaid } from "@/lib/actions/order/order-actions";
import type { PaymentResult } from "@/types";

//Invokes the paid-order Server Function after mount instead of during page render
const ConfirmStripePayment = ({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult: PaymentResult;
}) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    confirmStripeOrderPaid({ orderId, paymentResult }).then((res) => {
      if (!res.success) {
        console.error("Failed to confirm order payment:", res.message);
      }
    });
  }, [orderId, paymentResult]);

  return null;
};

export default ConfirmStripePayment;
