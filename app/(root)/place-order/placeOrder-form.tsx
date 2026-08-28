"use client";
import type { SubmitEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order/order-actions";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const PlaceOrderForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit: SubmitEventHandler<HTMLFormElement>= (event) => {
    event.preventDefault();
    if (isPending) return;

    startTransition(async () => {
      const res = await createOrder();

      if (!res.success) {
        toast.error(res.message);
      }

      if (res.redirectTo) {
        router.push(res.redirectTo);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Processing order...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Place Order
          </>
        )}
      </Button>
    </form>
  );
};

export default PlaceOrderForm;