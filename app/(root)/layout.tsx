import Navbar from "@/components/shared/header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/provider/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col ">
      <ThemeProvider
        attribute="class"
        enableSystem
        defaultTheme="system"
        disableTransitionOnChange
      >
        <Navbar />
        <main className="wrapper flex-1">{children}</main>
        <Footer />
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "bg-background border border-border p-4 rounded-lg flex items-center gap-2",
              success: "text-green-600",
              error: "text-destructive",
            },
          }}
        />
      </ThemeProvider>
    </div>
  );
}
