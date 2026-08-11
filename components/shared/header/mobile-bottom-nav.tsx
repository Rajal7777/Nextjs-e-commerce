import Link from "next/link";
import { Heart, ShoppingCart, UserIcon } from "lucide-react";
import { auth } from "@/auth";
import { cn } from "@/lib/utils";


const MobileBottomNav = async () => {
    const session = await auth();
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
            <div className={cn("grid h-12  grid-cols-3 items-center px-4", session && "grid-cols-2")}>
                <Link
                    href="/cart"
                    className="flex items-center justify-center text-muted-foreground"
                    aria-label="Cart"
                >
                    <ShoppingCart className="h-5 w-5" />
                </Link>

                <Link
                    href="/wishlist"
                    className="flex items-center justify-center text-muted-foreground"
                    aria-label="Wishlist"
                >
                    <Heart className="h-5 w-5" />
                </Link>

                {!session && (
                    <Link
                        href="/sign-in"
                        className="flex items-center justify-center text-muted-foreground"
                        aria-label="User"
                    >
                        <UserIcon className="h-5 w-5" />
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
