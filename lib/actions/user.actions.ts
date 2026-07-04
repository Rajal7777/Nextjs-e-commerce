"use server";

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { prisma } from "@/db/prisma";
import { hashSync } from "bcryptjs";
import { formatError } from "../utils";


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
    //after successful login{login redirect dashboard} nextjs throws a special errors after redirect so we tell next js that is not a real error continue redirect
    if (isRedirectError(error)) {
      throw error;
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

    console.log("user", user);
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

    //Sign in user to home page
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "Signed in successufully!" };
  } catch (error) {
    //case error thrown my next we move on to actual error
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
