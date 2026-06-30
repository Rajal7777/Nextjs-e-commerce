"use server";

import { signInFormSchema, signUpFormSchema } from "../constants/validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { prisma } from "@/db/prisma";
import { hashSync } from "bcryptjs";

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
    //after signIn() Next app router the success sigin is  redirect or implemented by throwing a special redirect error. If this is the special redirect error, don't treat it as a failure. Throw it again so Next.js can complete the redirect."
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Failed to signUp" };
  }
}

//Sign user out
export async function signoutUser() {
  await signOut();
}
