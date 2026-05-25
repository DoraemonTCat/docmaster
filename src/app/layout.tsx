/**
 * Root Layout
 * 
 * Layout หลักของแอป DocMaster
 * - Wrap ทั้งแอปด้วย DocumentProvider (mock data store)
 * - Import Google Font "Inter"
 * - SEO meta tags
 * 
 * git commit: "feat: setup root layout with DocumentProvider, Inter font, and SEO meta tags"
 */
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { DocumentProvider } from "@/context/DocumentContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "DocMaster — PDF Document Manager",
  description:
    "Upload, manage, and view your PDF documents with ease. A modern document management prototype built with Next.js.",
  keywords: ["PDF", "document manager", "upload", "viewer", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <DocumentProvider>{children}</DocumentProvider>
      </body>
    </html>
  );
}
