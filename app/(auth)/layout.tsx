// export default function AuthLayout({
//     children,
// }: Readonly<{children: React.ReactNode;}>){
//     return <div className="flex-center min-h-screen w-full">{children}</div>
// }

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: Readonly<AuthLayoutProps>) {
  return (
    <div className="flex-center min-h-screen w-full">
      {children}
    </div>
  );
}