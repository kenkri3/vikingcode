import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VikingCode | Autonom Vibecoding & Programvarebygger",
  description: "Bygg norske nettsider og applikasjoner autonomt. Med live sandbox preview, token-kontroll og 1-klikks Railway distribusjon.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="dark">
      <body className="bg-[#0A0D12] text-slate-100 min-h-screen antialiased selection:bg-[#7C3AED] selection:text-white">
        {children}
      </body>
    </html>
  );
}
