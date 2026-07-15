import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";
import UserButton from "./user-button";

//SideBar menu in md screen
const Menu = async () => {
    

    return (
        <div className="flex justify-end gap-3">
            <nav className="hidden md:flex w-full max-w-xs gap-1">
                <ModeToggle />
                <Button asChild variant='ghost'>
                    <Link href='/cart'>
                        <ShoppingCart /> Cart
                    </Link>
                </Button>

                <UserButton />
            </nav>

            {/* md screen */}
            <nav className="md:hidden">
                <Sheet>
                    <SheetTrigger className="align-middle">
                        <EllipsisVertical />
                    </SheetTrigger>

                    <SheetContent className="flex flex-col items-start pl-6">
                        <SheetTitle>Menu</SheetTitle>
                        <ModeToggle />

                        <Button asChild variant='ghost'>
                            <Link href='/cart'>
                                <ShoppingCart /> cart
                            </Link>
                        </Button>
                            <UserButton />
                   </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
};

export default Menu;