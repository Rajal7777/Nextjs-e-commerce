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

//eslist-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
    console.log('error', error);
  //handle zod validation error
  if (error instanceof ZodError) {
    return error.issues
    .map((issue) => issue.message)
    .join(". ");
  } else if (error.name === "PrismaClientKnownRequestError") {
    //handle prisma error
  } else {
    //handle other error
  }
}
