"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { USER_ROLES } from "@/lib/constants";
import { updateUserSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

//use the form form shadcn
const UpdateUserForm = ({
    user,
}: {
    user: z.infer<typeof updateUserSchema>;
}) => {
    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: user,
    });

    function onSubmit(data: z.infer<typeof updateUserSchema>) {
        // Handle form submission
    }

    return (
        <div className="w-full max-w-md mx-auto border p-6 rounded-lg mt-4">

            <form onSubmit={form.handleSubmit(onSubmit)} >
                <FieldGroup className="space-y-2 p-2">
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Email</FieldLabel>

                                <input {...field} disabled={true} type="email" className="w-full border p-1 rounded-md" />

                                {fieldState.error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Name</FieldLabel>

                                <input {...field} type="text" className="w-full border p-1 rounded-md" />

                                {fieldState.error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="role"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Role</FieldLabel>

                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>

                                    <SelectContent position="popper" side="bottom">
                                        {USER_ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>{role.charAt(0).toLocaleUpperCase() + role.slice(1)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex-between mt-2">
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Submitting...' : 'Sumbit'}
                    </Button>
                </div>
            </form>

        </div>
    );
};

export default UpdateUserForm;
