export const metadata = {
  title: "Summoners War Shop",
  description: "Summoners War Account Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
