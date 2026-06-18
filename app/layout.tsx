import type { Metadata } from "next";
import { Inter, Geist } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";
import { APP_NAME,SERVER_URL } from '@/lib/constants/index';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
 title: {
  template: `%s | Fun store`,
  default: APP_NAME
 },
  description: "A modern e-Commerce website.",
  metadataBase: new URL(SERVER_URL)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.className, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
