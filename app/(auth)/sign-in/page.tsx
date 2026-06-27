import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


export const metadata: Metadata = {
    title: 'Sign in'
}
const SignInpage = () => {
    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-4">
            <Link href='/' className="flex-center">
            <Image src='/images/logo.svg' alt={`${APP_NAME}`} />
            </Link>

                <CardTitle className="text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                    Sign in to you account
                </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                {/*  Sign in form */}
                </CardContent>
            </Card>
        </div>
    )

}

export default SignInpage;