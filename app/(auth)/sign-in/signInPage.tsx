"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user-actions";
import { useSearchParams } from "next/navigation";
import { signInDefaultValues } from "@/lib/constants";

import { signIn } from "next-auth/react";

const initialState = {
  success: false,
  message: "",
};

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.55-.23-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.39Z"
      />
      <path
        fill="#34A853"
        d="M12 21.7c2.63 0 4.84-.87 6.45-2.34l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.5A9.74 9.74 0 0 0 12 21.7Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 13.82A5.85 5.85 0 0 1 6.22 12c0-.63.11-1.24.31-1.82v-2.5H3.29A9.73 9.73 0 0 0 2.25 12c0 1.56.37 3.03 1.04 4.32l3.24-2.5Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.15c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.25 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.71 5.38l3.24 2.5c.77-2.31 2.93-4.03 5.47-4.03Z"
      />
    </svg>
  );
}

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

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl })}
      >
        <GoogleIcon />
        Continue with Google
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
