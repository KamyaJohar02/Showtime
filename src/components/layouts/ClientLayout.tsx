"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/context/AuthContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // Add all routes where you want to HIDE header/footer
  const hideHeaderFooterRoutes = ["/admin"];
  const isHiddenRoute = hideHeaderFooterRoutes.some(route => pathname.startsWith(route));

  return (
    <div className={inter.className}>
      <AuthProvider>
        {!isHiddenRoute && <Header />}
        {children}
        {!isHiddenRoute && <Footer />}
      </AuthProvider>
    </div>
  );
}
