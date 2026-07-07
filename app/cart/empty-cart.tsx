import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyCart = () => {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight">
                    Your cart is empty
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Looks like you haven&apos;t added anything to your cart yet.
                    Discover our products and find something you&apos;ll love.
                </p>

                <Button asChild className="mt-8 w-full">
                    <Link href="/">
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default EmptyCart;