import { ZodError } from "zod";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
//padEnd(length, character) adds characters to the end until the string reaches the specified length. used in sensitive number like account no 555*** ***
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

//Round number to two decimal places
export function roundDecimal(value: number | string) {
  const num = Number(value);

  if (isNaN(num)) {
    throw new Error("Invalid number");
  }

  return Math.round((num + Number.EPSILON) * 100) / 100;
}

//Foramat currecy
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-Us", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return NaN;
  }
}
