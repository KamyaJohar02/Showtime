"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Popover } from "@headlessui/react";
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
      className="bg-cover bg-center"
      style={{
        backgroundImage: "url('/Images/headerbg2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <nav className="mx-auto flex max-w-4xl items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Showtime</span>
            <Image
              src="/Images/logo.png"
              alt="Showtime Logo"
              width={200}
              height={100}
            />
          </Link>
        </div>

        {/* Hamburger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-black"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Nav */}
        <Popover.Group className="hidden lg:flex lg:items-center lg:gap-x-6">
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
              className="text-sm font-semibold text-black px-3 py-2 rounded-md hover:bg-gray-200 hover:shadow transition-all duration-200"
            >
              {item.name}
            </Link>
          ))}

          {/* Book Now CTA */}
          {/* <Link
            href="/book"
            className="ml-4 text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-md transition-all duration-200"
          >
            Book Now
          </Link> */}
          <button
            onClick={() => router.push("/booking")}
            className="ml-4 text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-md transition-all duration-200"
          >
            Book Now
          </button>
        </Popover.Group>

        {/* Desktop login/profile */}
<div className="hidden lg:flex lg:flex-1 lg:justify-end">
  <button
    onClick={() => router.push(user ? "/myprofile" : "/login")}
    className="text-sm font-semibold text-black px-3 py-2 rounded-md hover:bg-gray-200 hover:shadow transition-all"
  >
    {user ? "My Profile" : "Log in →"}
  </button>
</div>

      </nav>

      {/* Mobile Nav */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Showtime</span>
              <Image
                src="/Images/logo.png"
                alt="Showtime Logo"
                width={100}
                height={50}
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
                    href={`/${page}`}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-black hover:bg-gray-200 transition"
                  >
                    {page === "book" ? "Book Now" : page.charAt(0).toUpperCase() + page.slice(1)}
                  </Link>
                ))}
              </div>

              <div className="py-6">
                {user ? (
                  <>
                    <button
                      onClick={() => router.push("/myprofile")}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-black hover:bg-gray-200"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-black hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-black hover:bg-gray-200"
                  >
                    Log In
                  </button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

export default Header;
