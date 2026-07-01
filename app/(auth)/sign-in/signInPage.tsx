"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
import { signInDefaultValues } from "@/lib/constants";

const initialState = {
  success: false,
  message: "",
};

const SignInPage = () => {
  const [data, action, pending] = useActionState(
    signInWithCredentials,
    initialState,
  );

  //user who is not login try to check out then nextjs will redirect the user  to the  sign in page then to the checkout page
  //flow user clicks -> /checkout => Is the user logged in? no then redirect user to sign in | /sign-in?callbackUrl=/checkout After login, send the user back to /checkout.
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={signInDefaultValues.email}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          defaultValue={signInDefaultValues.password}
          autoComplete="password"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
      <div className="text-sm text-center text-muted-foreground">
        Dont&apos;t have an account?{" "}
        <Link href="/sign-up" target="_self" className=" hover:underline">
          Sign Up
        </Link>
      </div>
      {data && !data.success && (
        <p className="text-center text-destructive">{data.message}</p>
      )}
    </form>
  );
};

export default SignInPage;
