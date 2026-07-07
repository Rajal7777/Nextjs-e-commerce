"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PaymentMethodForm = ({
    prefferedPaymentMethod,
}: {
    prefferedPaymentMethod: string | null;
}) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: prefferedPaymentMethod || DEFAULT_PAYMENT_METHOD,
        },
    });


    function onSubmit(data: z.infer<typeof paymentMethodSchema>) {
        startTransition(async () => {
            const res = await updateUserPaymentMethod(data);

            if (!res.success) {
                toast.error(
                    <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4 bg-card text-card-foreground">
                        <code>{res.message}</code>
                    </pre>,
                );
                return;
            }

            router.push("/place-order");
        });
    }

    return (
        <Card className="w-full sm:max-w-md  mx-auto border-none ">
            <CardHeader>
                <CardTitle className="text-center">Payment Method</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h3 className="mb-4 text-lg font-semibold">Select Payment Method</h3>

                    {PAYMENT_METHODS.map((method) => (
                        <label
                            key={method}
                            className="mb-3 flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50 hover:text-black">
                            <input
                                type="radio"
                                value={method}
                                {...register("type")}
                                className="h-4 w-4"
                            />
                            <span>{method}</span>
                        </label>
                    ))}

                    {errors.type && (
                        <p className="mt-2 text-sm text-red-500">{errors.type.message}</p>
                    )}

                    <button
                        type="submit"
                        className="mt-6 w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
                    >
                        {isPending ? 'Loading...' : " Continue"}
                    </button>
                </form>
            </CardContent>
        </Card>
    );
};

export default PaymentMethodForm;
