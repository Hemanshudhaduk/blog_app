import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthorProvider } from "@/context/AuthorContext";
import { TopNav } from "@/components/Topnav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog Management System",
  description: "A full-featured blog platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthorProvider>
          <ReduxProvider>
            {/* Top nav visible on all pages — no dashboard/author UI here */}
            <TopNav />
            <main>{children}</main>
          </ReduxProvider>
        </AuthorProvider>
      </body>
    </html>
  );
}