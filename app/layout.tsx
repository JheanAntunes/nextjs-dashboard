import { inter } from "@/app/ui/fonts/fonts";
import "@/app/ui/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-br'>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
