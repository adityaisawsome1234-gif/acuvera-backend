import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

export const metadata: Metadata = {
  title: "Acuvera Enterprise",
  description: "Enterprise audit platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AnalyticsProvider />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
