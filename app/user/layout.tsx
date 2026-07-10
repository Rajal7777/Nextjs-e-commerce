import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";


export default function UserLayout({
    children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="border-b container mx-auto">
                    <div className="flex items-center h-16 px-4">
                        <Link href='/' className="w-22">
                            <Image
                                src='/images/logo.svg'
                                alt="logo"
                                loading="eager"
                                height={48}
                                width={48}
                            />
                        </Link>

                        {/* Main nav */}
                        <div className="ml-auto items-center flex space-x-4">
                            <Menu />
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
                    {children}
                </div>
            </div>
        </>
    );
}