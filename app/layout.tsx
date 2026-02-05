import type { Metadata } from "next";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "OpenSprint",
  description: "Community-powered sprint platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SessionProvider>{children}</SessionProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
