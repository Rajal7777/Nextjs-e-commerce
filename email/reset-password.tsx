import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type ResetPasswordEmailProps = {
  resetUrl: string;
};

export default function ResetPasswordEmail({
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Preview>Reset your {process.env.NEXT_APP_NAME ?? "NEXT STORE"}</Preview>

      <Tailwind>
        <Head />

        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-xl rounded-lg bg-white p-8">
            <Heading className="text-2xl font-bold text-gray-900">
              Reset Password
            </Heading>

            <Text className="text-gray-700">
              We received a request to reset your password.
            </Text>

            <Text className="text-gray-700">
              Click the button below to create a new password. This link will
              expire in 30 minutes.
            </Text>

            <Section className="my-6 text-center">
              <Button
                href={resetUrl}
                className="rounded-lg bg-blue-600 px-4 py-1 text-sm font-semibold text-white text-nowrap"
              >
                Reset Password &#10142;
              </Button>
            </Section>

            <Text className="text-sm text-gray-500">
              If you did not request a password reset, you can safely ignore
              this email.
            </Text>

            <Text className="text-sm text-gray-500">
              This link is valid for one time use.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
