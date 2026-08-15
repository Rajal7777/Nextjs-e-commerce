"use server";

import crypto from "node:crypto";
import { prisma } from "@/db/prisma";
import { resetPasswordSchema, updatePasswordSchema } from "../validators";
import { formatError } from "../utils";
import { hashSync } from "bcryptjs";

import { SERVER_URL } from "@/lib/constants";
import { sendResetPasswordEmail } from "@/email";

//request password reset action
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
    };

    if (!user) {
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

    //delete any existing tokens for the user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    //store the hashed token and expiration time in the db
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: expirationTime,
      },
    });

    //create the reset url
    const resetUrl = `${SERVER_URL}/reset-password?token=${encodeURIComponent(rawToken)}`;

    await sendResetPasswordEmail({ email: validatedEmail, resetUrl });

    return genericMessage;
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//update password action
export async function resetPassword(data: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    //validate the user input data
    const validatedData = updatePasswordSchema.parse(data);

    //hash the token
    const tokenHash = crypto
      .createHash("sha256")
      .update(validatedData.token)
      .digest("hex");

    //compare check if the token exists and is valid
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!resetToken) {
      throw new Error("Invalid or expired reset token");
    }

    //if the token has expired, delete it from the db and throw an error
    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      });
      throw new Error("Invalid or expired reset token");
    }

    //valid token, then hash new password and update the user password
    const hashedPassword = hashSync(validatedData.password, 10);

    //update the user password and delete the reset token at the same time using a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      }),
      prisma.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      }),
    ]);

    return {
      success: true,
      message: "Password has been reset successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
