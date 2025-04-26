"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel, Popover } from "@headlessui/react";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className="relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/Images/bgok.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Left - Logo */}
        <div className="flex flex-1">
          <Link href="/" passHref className="-m-1.5 p-1.5">
            <span className="sr-only">Showtime</span>
            <Image
              src="/Images/logo.png"
              alt="Showtime Logo"
              width={200}
              height={100}
              className="cursor-pointer object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center - Menu */}
        <div className="hidden lg:flex flex-1 justify-center space-x-4">
          {[
            { name: "About Us", href: "/about" },
            { name: "Services", href: "/services" },
            { name: "Rooms", href: "/rooms" },
            { name: "Gallery", href: "/gallery" },
            { name: "FAQs", href: "/faq" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-black bg-gray-200 px-4 py-1.5 rounded-md whitespace-nowrap hover:bg-white hover:shadow transition-all duration-200"
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => router.push("/booking")}
            className="text-sm font-semibold bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 shadow-md whitespace-nowrap transition-all duration-200"
          >
            Book Now
          </button>
        </div>

        {/* Right - Login/Profile */}
        <div className="hidden lg:flex flex-1 justify-end">
          <button
            onClick={() => router.push(user ? "/myprofile" : "/login")}
            className="text-sm font-semibold text-black bg-gray-200 px-2.5 py-1.5 rounded-md hover:bg-white hover:shadow transition-all"
          >
            {user ? "👤 My Profile" : "👤 Log in"}
          </button>
        </div>

        {/* Hamburger for mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" passHref className="-m-1.5 p-1.5">
              <span className="sr-only">Showtime</span>
              <Image
                src="/Images/logo.png"
                alt="Showtime Logo"
                width={140}
                height={70}
                className="cursor-pointer object-contain"
                priority
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {["about", "services", "rooms", "gallery", "faq", "book"].map((page) => (
                  <Link
                    key={page}
                    href={page === "book" ? "/booking" : `/${page}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg bg-gray-200 px-3 py-2 text-base font-semibold text-black hover:bg-white transition"
                  >
                    {page === "book" ? "Book Now" : page.charAt(0).toUpperCase() + page.slice(1)}
                  </Link>
                ))}
              </div>

              <div className="py-6">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/myprofile");
                      }}
                      className="-mx-3 block rounded-lg bg-gray-200 px-3 py-2.5 text-base font-semibold text-black hover:bg-white"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="-mx-3 block rounded-lg bg-gray-200 px-3 py-2.5 text-base font-semibold text-black hover:bg-white"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push("/login");
                    }}
                    className="-mx-3 block rounded-lg bg-gray-200 px-3 py-2.5 text-base font-semibold text-black hover:bg-white"
                  >
                    Log In
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default Header;
