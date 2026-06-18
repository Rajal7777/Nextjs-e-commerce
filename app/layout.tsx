import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";
import { APP_NAME, SERVER_URL } from '@/lib/constants/index';
import Navbar from "@/components/shared/header";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";



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
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.className, "font-sans")}
    >
     <body className="h-screen flex flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          <main className="wrapper flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
