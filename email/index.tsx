import { Resend } from "resend";
import { APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import PurchaseReceiptEmail from "./purchase-receipt";
import ResetPasswordEmail from "./reset-password";

//from  <${SENDER_EMAIL}> add it later after deploying to vercel, for now just use the APP_NAME as the sender name
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async ({
  order,
}: {
  order: Order;
}) => {
  try {
    await resend.emails.send({
      from: `${APP_NAME} <onboarding@resend.dev>`,
      to: order.user.email,
      subject: `Order Confirmation - ${APP_NAME}`,
      react: <PurchaseReceiptEmail order={order} />,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
};

//email for reset password
export const sendResetPasswordEmail = async ({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}) => {
  try {
    await resend.emails.send({
      from: `${APP_NAME} <onboarding@resend.dev>`,
      to: email,
      subject: `Reset your password - ${APP_NAME}`,
      react: <ResetPasswordEmail resetUrl={resetUrl} />,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
};
