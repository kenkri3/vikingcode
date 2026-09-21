import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0D12",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aiprogram.no"),
  title: "AIProgram.no | Autonom Programvarebygger & Vibecoding",
  description:
    "Bygg norske nettsider og applikasjoner autonomt på aiprogram.no. Live sandbox preview, token-sikkerhet, GitHub-eksport og 1-klikks Railway distribusjon.",
  openGraph: {
    title: "AIProgram.no | Autonom Programvarebygger",
    description: "Bygg norske nettsider og applikasjoner autonomt. Med live sandbox preview og 1-klikks Railway distribusjon.",
    url: "https://aiprogram.no",
    siteName: "AIProgram.no",
    locale: "nb_NO",
    type: "website",
  },
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
