import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Acuvera | AI-Powered Medical Billing Intelligence",
  description:
    "Detect billing errors, prevent denials, and protect revenue with AI-powered medical bill analysis. Clarity in every medical bill.",
  icons: { icon: "/acuvera-logo.png" },
  metadataBase: new URL("https://acuvera.co"),
  openGraph: {
    title: "Acuvera — AI-Powered Medical Billing Intelligence",
    description: "Detect errors, reduce denials, and restore trust in healthcare payments.",
    siteName: "Acuvera",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acuvera — Clarity in Every Medical Bill",
    description: "AI-powered billing intelligence for providers, patients, and revenue cycle teams.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
