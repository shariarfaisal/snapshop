export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full min-h-screen">
      <header className="sticky top-0 left-0 w-full p-4 ">
        <h1 className="text-xl font-semibold">SnapShop</h1>
      </header>
      {children}
    </div>
  );
}
