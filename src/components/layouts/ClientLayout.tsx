"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserProvider } from "@/components/context/UserContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className={inter.className}>
      <UserProvider>
        {!isAdminRoute && <Header />}
        {children}
        {!isAdminRoute && <Footer />}
      </UserProvider>
    </div>
  );
}
