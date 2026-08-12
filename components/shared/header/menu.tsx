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
          className="flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-300 hover:bg-accent rounded-full p-2"
          aria-label="Wishlist"
        >
          <Heart className="h-5 w-5" />
        </Link>

        <Button
          variant="ghost"
          size="icon-lg"
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Link href="/cart" aria-label="Cart" className="flex items-center justify-center  text-muted-foreground">
            <ShoppingCart className="size-5" />
          </Link>
        </Button>

      </nav>
        <UserButton />
    </div>
  );
};

export default Menu;
