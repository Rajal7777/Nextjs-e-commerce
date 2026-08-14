import Navbar from "@/components/shared/header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/shared/header/mobile-bottom-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col ">
      <Navbar />
      <main className="wrapper flex-1 pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
