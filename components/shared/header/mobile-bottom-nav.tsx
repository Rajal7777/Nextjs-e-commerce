import Link from "next/link";
import { Heart,  ShoppingCart, UserIcon } from "lucide-react";

const MobileBottomNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="grid h-10  grid-cols-3 items-center px-4">
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

        <Link
          href="/sign-in"
          className="flex items-center justify-center text-muted-foreground"
          aria-label="User"
        >
          <UserIcon className="h-5 w-5" />
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
