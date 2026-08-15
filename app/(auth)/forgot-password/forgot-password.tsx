"use client";

import { SubmitEventHandler, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/password-reset-actions";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await requestPasswordReset(email);

      setMessage(res.message);
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) =>setEmail(e.target.value) }
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm  outline-none"
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending" : "Send reset link"}
        </Button>

        {message && (
          <p className="text-center text-sm text-muted-foreground">{message}</p>
        )}

        <div>
          <Link
            href="/sign-in"
            className="text-muted-foreground hover:underline"
          >
            Back to Signin
          </Link>
        </div>
      </div>
    </form>
  );
};


export default ForgotPasswordForm;