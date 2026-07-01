import { ZodError } from "zod";

export const APP_NAME = process.env.NEXT_APP_NAME || "New-store";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

//Format error message for zod validation errors & prisma error
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  //handle zod validation error
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join(". ");
  }

  //Prisma error handling(email already exists)
if (typeof error === "object" && error !== null && "code" in error) {
  const prismaError = error as any;

  if (prismaError.code === "P2002") {
    const target = prismaError.meta?.target;

    // Prisma usually returns: ["email"] or "email"
    const field = Array.isArray(target)
      ? target[0]
      : typeof target === "string"
      ? target
      : "Field";

    return `${field} already exists.`;
  }
}

  if (typeof error === "string") {
    return error;
  }

  return JSON.stringify(error?.message ?? error);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
