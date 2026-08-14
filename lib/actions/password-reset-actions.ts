"use server";

import crypto from "node:crypto";
import { prisma } from "@/db/prisma";
import { resetPasswordSchema } from "../validators";
import { formatError } from "../utils";

export async function requestPasswordReset(email: string) {
  try {
    //validate email
    const { email: validatedEmail } = resetPasswordSchema.parse({ email });

    //check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email: validatedEmail,
      },
    });

    //generic message to avoid revealing if the email exists or not
    const genericMessage = {
        success: true,
        message: "If the email exists, a password reset link has been sent.",
    }

    if(!user) {
        return genericMessage;
    }

    //generate random token and store the hash on the db
     const rawToken = crypto.randomBytes(32).toString("hex");
     const tokenHash = crypto
     .createHash("sha256")
     .update(rawToken)
     .digest("hex");

     //30 minutes expiration time
     const expirationTime = new Date(Date.now() + 30 * 60 * 1000);


        //store the hashed token and expiration time in the db
        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: expirationTime,
            }
        })


  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
