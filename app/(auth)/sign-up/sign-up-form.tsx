"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
import { signUpDefaultValues } from "@/lib/constants";

const initialState = {
  success: false,
  message: "",
};

const SignUpForm = () => {
  const [data, action, pending] = useActionState(signUpUser, initialState);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
     <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={signUpDefaultValues.name}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={signUpDefaultValues.email}
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
          autoComplete="password"
          defaultValue={signUpDefaultValues.password}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Enter your password"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Passord
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="confirmPassword"
          defaultValue={signUpDefaultValues.confirmPassword}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Enter your password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
      <div className="text-sm text-center text-muted-foreground">
      Already have an account?{" "}
        <Link href="/sign-in" target="_self" className=" hover:underline">
          Sign In
        </Link>
      </div>
      {data && !data.success && (
        <p className="text-center text-destructive">{data.message}</p>
      )}
    </form>
  );
};

export default SignUpForm;
