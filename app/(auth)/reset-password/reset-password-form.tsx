"use client";

import { SubmitEventHandler, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/actions/password-reset-actions";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await resetPassword({
        token,
        password,
        confirmPassword,
      });

      setMessage(res.message);

      if (res.success) {
        router.push("/sign-in?reset=success");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          New password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm password
        </label>

        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={6}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Updating..." : "Update password"}
      </Button>

      {message && (
        <p className="text-center text-sm text-muted-foreground">{message}</p>
      )}

      <div className="text-center text-sm">
        <Link href="/sign-in" className="text-muted-foreground hover:underline">
          Back to sign in
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
