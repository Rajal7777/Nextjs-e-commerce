import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

const ResetPasswordPage = async ({
  searchParams,
}: ResetPasswordPageProps) => {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Invalid reset link</CardTitle>
            <CardDescription>
            Reset link is missing its token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/forgot-password" className="hover:underline">
              Request a new reset link
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/store-icon.jpg"
              alt={APP_NAME}
              width={100}
              height={100}
              preload
              loading="eager"
              className="rounded-full"
            />
          </Link>

          <CardTitle className="text-center">
            Reset Password
          </CardTitle>

          <CardDescription className="text-center">
            Enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;