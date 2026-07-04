"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { shippingAdressDefaultValue } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ShippingAddressForm = ({ address }: { address: ShippingAddress; }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAdressDefaultValue,
    });


    // 3. Destructure isSubmitSuccessful and reset
    const { reset, formState: { isSubmitSuccessful } } = form;

    // 4. Trigger reset when submission succeeds
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(shippingAdressDefaultValue);
        }
    }, [isSubmitSuccessful, reset]);

    function onSubmit(data: z.infer<typeof shippingAddressSchema>) {
        console.log('data', data);
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        });
    }
    return (
        <Card className="w-full sm:max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Shipping Address Form</CardTitle>
                <CardDescription>
                    Please fill out the form for delivery.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="fullName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>

                                    <Input {...field} id="fullName" />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="streetAddress"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="streetAddress">Street Address</FieldLabel>
                                    <Input {...field} id="streetAddress" />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="city"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="city">City</FieldLabel>
                                    <Input {...field} id="city" />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="postalCode"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                                    <Input {...field} id="postalCode" />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="country"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="country">Country</FieldLabel>
                                    <Input {...field} id="country" />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Field orientation="responsive">
                          <Button type="submit" disabled={isPending} form="form-rhf-demo" onClick={() => form.resetField}>
                                {isPending ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight w-4 h-4 />
                                )} Continue
                            </Button>
                        </Field>

                    </FieldGroup>
                </form>
            </CardContent>

        </Card>
    );
};

export default ShippingAddressForm;
