"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/user/user-actions";
import { updateProfileSchema } from "@/lib/validators";
import { UploadButton } from "@/lib/uploadThing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";

const ProfileForm = () => {
    const { data: session, update } = useSession();
    //same as isLoading state upadte takes certain time so
    //tells react this part is not urgent keep the ui responsive
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const { handleSubmit, reset, control, setValue } = useForm<
        z.infer<typeof updateProfileSchema>
    >({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
            image: session?.user?.image ?? "",
        },
    });

    // Avatar url is a registered form field; watch it for the live preview.
    const image = useWatch({ control, name: "image" }) ?? "";

    //session may not be loaded at first render name & email might be empty{undefined}
    useEffect(() => {
        reset({
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
            image: session?.user?.image ?? "",
        });
    }, [reset, session?.user?.email, session?.user?.name, session?.user?.image]);

    function onSubmit(data: z.infer<typeof updateProfileSchema>) {
        startTransition(async () => {
            const result = await updateProfile(data);

            if (!result.success) {
                toast.error(
                    <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4 bg-card text-card-foreground">
                        <code>{result.message}</code>
                    </pre>,
                );
                return;
            }

            await update({
                name: data.name,
                email: data.email,
                image,
            });
            router.refresh();
            toast.success(result.message);
        });
    }

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <p>{session?.user?.email}</p>

                        {/* Profile logo / avatar */}
                        <Field>
                            <FieldLabel>Profile Logo</FieldLabel>
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border">
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt={session?.user?.name ?? "Profile logo"}
                                            fill
                                            sizes="64px"
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-semibold">
                                            {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                                        </span>
                                    )}
                                </div>
                                <UploadButton
                                    endpoint="imageUploader"
                                    appearance={{
                                        button:
                                            "bg-primary/60 px-2 py-1 text-primary-foreground hover:bg-primary/90",
                                        allowedContent: "text-muted-foreground",
                                    }}
                                    onClientUploadComplete={(res) => {
                                        const url = res?.[0]?.ufsUrl ?? res?.[0]?.url;

                                        if (url) {
                                            setValue("image", url, {
                                                shouldDirty: true,
                                            });

                                            toast.success("Logo uploaded. Click Save to apply.");
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Upload failed: ${error.message}`);
                                    }}
                                />
                            </div>
                        </Field>

                        <Controller
                            control={control}
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

                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileForm;
