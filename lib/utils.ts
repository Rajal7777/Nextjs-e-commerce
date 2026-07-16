import { ZodError } from "zod";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

//Format error message for zod validation errors & prisma error
export function formatError(error: unknown) {
  //handle zod validation error
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join(". ");
  }

  //Prisma error handling(email already exists)
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    const prismaError = error as {
      code?: string;
      meta?: { target?: string | string[] };
    };

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

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : JSON.stringify(error);
  }

  return JSON.stringify(error);
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

//Format currecy
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

//Format number returns "1,000"
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function formatNumber(number: number){
  return NUMBER_FORMATTER.format(number);
}

//Shorten UUid
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

//Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated year name (e.g., '25')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions,
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions,
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions,
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

//Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params) as Record<
    string,
    string | string[] | null | undefined
  >;

  // Don't keep invalid values
  const validValue = value && value !== "NaN" ? value : null;

  // Update the query
  query[key] = validValue;

  // Remove empty values
  for (const key in query) {
    if (
      query[key] === null ||
      query[key] === undefined ||
      query[key] === "" ||
      query[key] === "NaN"
    ) {
      delete query[key];
    }
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    },
  );
}
