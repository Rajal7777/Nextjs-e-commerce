"use server";

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from "../../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { prisma } from "@/db/prisma";
import { hashSync } from "bcryptjs";
import { formatError } from "../../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import { PAGE_SIZE } from "../../constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

export type ActionResult =
  { success: true; message: string } | { success: false; message: string };

//Sign in the user with credentials
//useActionState automatically passes two arguments prevState, formdata
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    //Validate form data
    const userCredential = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Get callback URL from form
    const callbackUrlValue = formData.get("callbackUrl");

    // Validate callback URL to prevent open redirects
    const callbackUrl =
      typeof callbackUrlValue === "string" && callbackUrlValue
        ? callbackUrlValue
        : "/";

    // Sign in and redirect after successful authentication
    await signIn("credentials", {
      ...userCredential,
      redirectTo: callbackUrl,
    });

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    // Let Next.js handle the redirect error
    if (isRedirectError(error)) {
      throw error; // rethrow error
    }

    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // Get callback URL from form
    const callbackUrlValue = formData.get("callbackUrl");

    // Validate callback URL to prevent open redirects
    const callbackUrl =
      typeof callbackUrlValue === "string" &&
      callbackUrlValue.startsWith("/") &&
      !callbackUrlValue.startsWith("//")
        ? callbackUrlValue
        : "/";

    // Plain password before hashing
    const plainPassword = user.password;

    // Hash password
    const hashedPassword = hashSync(plainPassword, 10);

    // Save user to database
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    // Auto sign-in after sign-up
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
      redirectTo: callbackUrl,
    });

    return {
      success: true,
      message: "Signed in successfully!",
    };
  } catch (error) {
    // Re-throw redirect error so Next.js can handle navigation
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Sign user out
export async function signoutUser() {
  await signOut();
}

//user object by id
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
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Update user payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("You must be signed in.");
    }

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    //run time validation of payment type
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
    return {
      success: false,
      message: formatError(error),
    };
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
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query?: string;
}) {
  const searchText = query?.trim();
  const where: Prisma.UserWhereInput | undefined = searchText
    ? {
        OR: [
          {
            name: {
              contains: searchText,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: searchText,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : undefined;

  // Guard against NaN/float inputs coming from query parsing.
  const normalizedPage = Number.isFinite(page) ? Math.trunc(page) : 1;
  const normalizedLimit = Number.isFinite(limit)
    ? Math.trunc(limit)
    : PAGE_SIZE;

  const safePage = Math.max(1, normalizedPage);
  const safeLimit = Math.min(Math.max(1, normalizedLimit), 100);

  const [data, dataCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: safeLimit,
      skip: (safePage - 1) * safeLimit,
    }),

    prisma.user.count({ where }),
  ]);

  return {
    data,
    totalPages: Math.ceil(dataCount / safeLimit),
    totalItems: dataCount,
  };
}

//delete user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "Successfully deleted user",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Update user information by admin
export async function updateUser(data: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        role: data.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "Successfully updated user",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
