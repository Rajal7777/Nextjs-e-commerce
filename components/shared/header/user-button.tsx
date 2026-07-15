import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signoutUser } from "@/lib/actions/user.actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";



const UserButton = async () => {
    const session = await auth();
  
 if (!session) {
        return (
            <Button asChild>
                <Link href='/sign-in'>
                    <UserIcon /> Sign In
                </Link>
            </Button>
        );
    }

    //?? means if every thing in the left is null || undefine then use right side value
    const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'Z';

    return (
        <div className="flex gap-2 items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center">
                        <Button variant='ghost' className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
                            {firstInitial}
                        </Button>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <div className="text-sm font-medium leading-none">
                                {session.user?.name}
                            </div>
                            <div className="text-xs text-muted-foreground leading-none">
                                {session.user?.email}
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuItem>
                        <Link href='/user/profile' className="w-full">
                       profile
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Link href='/user/orders'className="w-full">
                        Order History
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="p-0 mb-1">
                        <form className="w-full">
                            <Button
                                onClick={signoutUser}
                                className="w-full py-4 px-2 h-4 justify-start" variant='ghost'>
                                Sign Out
                            </Button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default UserButton;