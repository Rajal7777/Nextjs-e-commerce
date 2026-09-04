"use client";

import { useEffect } from "react";

// Catches errors thrown by the root layout itself, which app/error.tsx cannot handle
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string; };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
                    <h2 className="text-2xl font-bold">Something went wrong!</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        A critical error occurred. Please try again.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
