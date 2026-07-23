"use server";

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { prisma } from "@/db/prisma";
import { hashSync } from "bcryptjs";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";

//Sign in the user with credentials
//useActionState, React automatically passes two arguments prevState, formdata
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  //Validate form data:- email is valid password  long enough
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    //const [state] = useActionState(...)  here my state expects a success and message
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    //redirect() works by throwing a secret error.try...catch accidentally traps that secret error.throw error forwards the secret error back to Next.js so the page transition actually happens
    if (isRedirectError(error)) {
      throw error; // rethrow error
    }

    return { success: false, message: "Invalid email or password" };
  }
}

//Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    //Plain password before hashed
    const plainPassword = user.password;

    //hash password
    user.password = hashSync(user.password, 10);

    //save user signUp data to db
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    //Sign in user to home page after sign up
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "Signed in successufully!" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

//Sign user out
export async function signoutUser() {
  await signOut();
}

//Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found!");

  return user;
}

//Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    //user login?
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("You must be signed in.");
    }

    //user exist in db ? get data
    const currentUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User address updated successfully!",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Update user payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    //run time validation of payment type via zod
    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Update user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("You must be signed in.");
    }

    const currentUser = await prisma.user.findFirst({
      where: { id: session.user.id },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: user.name,
        email: user.email,
      },
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();
  console.log("dataCount", dataCount);
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
