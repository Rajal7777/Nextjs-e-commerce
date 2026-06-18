import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, UserIcon } from "lucide-react";
import ModeToggle from "./mode-toggle";



const Navbar = () => {
    return (
        <nav className="w-full border-b">
            <div className="wrapper flex-between">
                <div className="flex-start ">
                    <Link href="/" className="flex-start">
                        <Image
                            src="/images/logo.svg"
                            alt={`${APP_NAME} logo`}
                            width={48}
                            height={48}
                        />
                        <span className="hidden lg:block font-bold text-2xl ml-3">{APP_NAME}</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                        <Button asChild variant='outline'>
                            <Link href='/cart'>
                            <ShoppingCart /> Cart
                             </Link>
                        </Button>
                        <Button asChild>
                            <Link href='/sign-in'>
                            <UserIcon /> Sign In
                             </Link>
                        </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;