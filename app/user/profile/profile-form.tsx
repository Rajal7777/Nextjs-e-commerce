'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/user.actions";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProfileForm = () => {
    const { data: session, update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
        },
    });

    const { handleSubmit, reset } = form;

    useEffect(() => {
        reset({
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
        });
    }, [reset, session?.user?.email, session?.user?.name]);

    function onSubmit(data: z.infer<typeof updateProfileSchema>) {
        startTransition(async () => {
            const result = await updateProfile({
                name: data.name,
                email: data.email,
            });

            if (!result?.success) {
                toast.error(result?.message ?? "Unable to update profile");
                return;
            }

            await update({
                name: data.name,
                email: data.email,
            });
            toast.success("Profile updated successfully");
        });
    }

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <p>{session?.user?.email}</p>
                        <Controller
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input {...field} id="name" placeholder="Enter your name" />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
{/* 
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id="email"
                                        disabled
                                        placeholder="Enter your email"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        /> */}

                        <Button type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileForm;