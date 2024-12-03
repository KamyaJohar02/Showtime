"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserProvider } from "@/components/context/UserContext";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Check if the current route starts with "/admin"
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        <UserProvider>
          {/* Render Header only if not on admin route */}
          {!isAdminRoute && <Header />}
          {children}
          {/* Render Footer only if not on admin route */}
          {!isAdminRoute && <Footer />}
        </UserProvider>
      </body>
    </html>
  );
}
