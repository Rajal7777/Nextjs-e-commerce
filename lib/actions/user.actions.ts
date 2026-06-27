'use server';

import { signInFormSchema } from "../constants/validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";



//Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    //Validate form data:- email is valid password is long enough
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });

        await signIn('credentials', user);

        return { success: true, message: 'Signed in successfully' };
    } catch (error) {
        //after successful login{login redirect dashboard} nextjs throw a special errors after redirect so we tell next js that is not a real error continue redirect
        if (isRedirectError(error)) {
            throw error;
        }

        return { success: false, message: 'Invalid email or password' };
    }
}


//Sign user out
export async function signoutUser(){
    await signOut();
}