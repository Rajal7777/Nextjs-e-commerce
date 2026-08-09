import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import UserButton from "./user-button";

//SideBar menu in md screen
const Menu = async () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />

        <Link
          href="/wishlist"
          className="flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-300"
          aria-label="Wishlist"
        >
          <Heart className="h-4 w-4" />
        </Link>

        <Button asChild variant="ghost">
          <Link href="/cart" aria-label="Cart" className="flex items-center justify-center  text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
          </Link>
        </Button>

        <UserButton />
      </nav>
    </div>
  );
};

export default Menu;
