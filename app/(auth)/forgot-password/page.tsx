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
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { APP_NAME } from "@/lib/constants";
import ForgotPasswordForm from "./forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password",
};

const ForgotPasswordPage = async () => {
  const session = await auth();


  //if user logged in then send to home page 
 if (session) {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              alt={APP_NAME}
              width={100}
              height={100}
              preload
              loading="eager"
            />
          </Link>

          <CardTitle className="text-center">
            Forgot Password
          </CardTitle>

          <CardDescription className="text-center">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;