import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Authentication error",
};

type AuthErrorCode =
    | "Configuration"
    | "AccessDenied"
    | "Verification"
    | "CredentialsSignin"
    | "Default";

const errorMessages: Record<AuthErrorCode, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to access this page.",
    Verification: "Your verification link is invalid or has expired.",
    CredentialsSignin: "Your email or password is incorrect.",
    Default: "Something went wrong while signing you in.",
};

function getErrorMessage(error?: string) {
    if (error && error in errorMessages) {
        return errorMessages[error as AuthErrorCode];
    }

    return errorMessages.Default;
}

export default async function AuthErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; }>;
}) {
    const { error } = await searchParams;

    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-2 text-center">
                    <CardTitle>Sign-in failed</CardTitle>
                    <CardDescription>{getErrorMessage(error)}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground">{APP_NAME}</p>
                    <Button asChild>
                        <Link href="/sign-in">Back to sign in</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
