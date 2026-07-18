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
            classNames: {
              toast:
                "bg-background border shadow-lg text-foreground rounded-xl",
              success:
                "bg-green-600 text-white border-green-700",
              error:
                "bg-red-600 text-white border-red-700",
              warning:
                "bg-yellow-500 text-black",
              info:
                "bg-blue-600 text-white",
              title: "font-semibold",
              description: "text-sm",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted",
            },
          }}
        />
      </ThemeProvider>
    </div>
  );
}
