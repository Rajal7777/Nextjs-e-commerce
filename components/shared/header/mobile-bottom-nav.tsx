import Link from "next/link";
import { Heart, Home, ShoppingCart, } from "lucide-react";
import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import { getMyCart } from "@/lib/actions/cart/cart-actions";
import { getWishlistIds } from "@/lib/actions/wishlist/wish.action";
import ModeToggle from "@/components/mode-toggle";


const MobileBottomNav = async () => {
    const [session, cart, wishlistIds] = await Promise.all([
        auth(),
        getMyCart(),
        getWishlistIds(),
    ]);
    const cartItemCount = cart?.items.reduce((total, item) => total + item.qty, 0) ?? 0;
    const wishlistItemCount = wishlistIds.length;
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
            <div className={cn("grid h-14 items-center px-4", session ? "grid-cols-4" : "grid-cols-4")}>
                <Link
                    href="/"
                    className="flex h-full items-center justify-center text-muted-foreground"
                    aria-label="Home"
                    title="Home"
                >
                    <Home className="h-5 w-5" />
                </Link>

                <Link
                    href="/cart"
                    className="relative flex h-full items-center justify-center text-muted-foreground"
                    aria-label={`Cart with ${cartItemCount} items`}
                >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                        <span className="absolute left-1/2 top-2 ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-700 px-1 text-[10px] font-semibold text-white">
                            {cartItemCount}
                        </span>
                    )}
                </Link>

                <Link
                    href="/wishlist"
                    className="relative flex items-center justify-center text-muted-foreground"
                    aria-label={`Wishlist with ${wishlistItemCount} items`}
                >
                    <Heart className="h-5 w-5" />
                    {wishlistItemCount > 0 && (
                        <span className="absolute left-1/2 -top-2 ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                            {wishlistItemCount}
                        </span>
                    )}
                </Link>

                {/* Theme toggle (same component used in the desktop nav) */}
                <div className="flex items-center justify-center">
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
};

export default MobileBottomNav;
