export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-bg-primary text-text-primary min-h-screen">
      {children}
    </div>
  );
}
