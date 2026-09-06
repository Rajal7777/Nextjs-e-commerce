type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: Readonly<AuthLayoutProps>) {
  return (
    <div className="flex-center min-h-screen w-full p-2">
      {children}
    </div>
  );
}