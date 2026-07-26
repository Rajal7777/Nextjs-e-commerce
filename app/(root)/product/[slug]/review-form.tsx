"use client";

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReviewSchema } from "@/lib/validators";
import { date, z } from "zod";
import { reviewFormDefaultValues } from "@/lib/constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StarIcon } from "lucide-react";
import { createUpdateReview, getSingleReview } from "@/lib/actions/review.actions";
import { toast } from "sonner";

type CustomerReviewInput = z.input<typeof insertReviewSchema>;
type CustomerReview = z.output<typeof insertReviewSchema>;

const ReviewForm = ({
    userId,
    productId,
    onReviewSubmitted,
}: {
    userId: string;
    productId: string;
    onReviewSubmitted: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const formDefaultValues: CustomerReviewInput = {
        ...reviewFormDefaultValues,
        userId,
        productId,
    };

    const form = useForm<CustomerReviewInput, unknown, CustomerReview>({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: formDefaultValues,
    });

    //handle dialog opener
    async function handleOpenForm() {
        form.setValue('productId', productId);
        form.setValue('userId', userId);

        const res = await getSingleReview({ productId });

        if(res){
            form.setValue('title', res.title);
            form.setValue('description', res.description);
            form.setValue('rating', res.rating);
        }
        setOpen(true);
}

    const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
        data: CustomerReview,
    ) => {
        const res = await createUpdateReview({
            ...data,
            productId,
        });

        if (!res.success) {
            return toast.error(res.message);
        }

        setOpen(false);

        onReviewSubmitted();

        toast.success(res.message);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenForm} variant="default">
                Write a review
            </Button>

            <DialogContent className="sm:max-w-106">
                <DialogHeader>
                    <DialogTitle>Write a review</DialogTitle>
                    <DialogDescription>
                        Share your thoughts about the product. Your feedback is valuable to
                        us and helps other customers make informed decisions.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <form id="review-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Title</FieldLabel>
                                        <Input {...field} placeholder="Enter title" />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea placeholder="Enter description" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="rating"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Rating</FieldLabel>
                                        <Select
                                            value={String(field.value ?? "")}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a rating" />
                                            </SelectTrigger>

                                            <SelectContent position="popper">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={(index + 1).toString()}
                                                    >
                                                        {index + 1} <StarIcon className="inline h-4 w-4" />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </div>

                <DialogFooter>
                    <Button
                        type="submit"
                        form="review-form"
                        size="lg"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewForm;
