import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rapid Report",
  description: "AI-Powered accessibilty issue reporting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-600 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
