import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignInPage from "./signInPage";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { APP_NAME } from "@/lib/constants";


export const metadata: Metadata = {
    title: 'Sign in'
};

const SignInpage = async (props: {
    searchParams: Promise<{
        callbackUrl: string;
    }>;
}) => {

    const { callbackUrl } = await props.searchParams;
    const session = await auth();

    if (session) {
        return redirect(callbackUrl || '/');
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-4">
                    <Link href='/' className="flex-center">
                        <Image src='/images/logo.svg' alt={`${APP_NAME}`} width={100} height={100} preload={true}
                            loading="eager" />
                    </Link>

                    <CardTitle className="text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to you account
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <SignInPage />
                </CardContent>
            </Card>
        </div>
    );

};

export default SignInpage;