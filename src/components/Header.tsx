"use client";
import React, { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/context/UserContext";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

function Header() {
  const router = useRouter();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home page
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
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Showtime</span>
            <Image
              className="h-12 w-auto"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Showtime.svg/2560px-Showtime.svg.png"
              alt="Showtime Logo"
              width={150}
              height={50}
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-black"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link href="/about" className="text-sm font-semibold leading-6 text-black">
            About Us
          </Link>
          <Link href="/services" className="text-sm font-semibold leading-6 text-black">
            Services
          </Link>
          <Link href="/rooms" className="text-sm font-semibold leading-6 text-black">
            Rooms
          </Link>
          <Link href="/gallery" className="text-sm font-semibold leading-6 text-black">
            Gallery
          </Link>
          <Link href="/faq" className="text-sm font-semibold leading-6 text-black">
            FAQs
          </Link>
        </Popover.Group>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <Link href="/myprofile" className="text-sm font-semibold leading-6 text-black">
              My Profile
            </Link>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-sm font-semibold leading-6 text-black"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </div>
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />

        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Showtime</span>
              <Image
                className="h-8 w-auto"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Showtime.svg/2560px-Showtime.svg.png"
                alt=""
                width={100}
                height={50}
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="/about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-blue-800"
                >
                  About Us
                </a>
                <a
                  href="/services"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-blue-800"
                >
                  Services
                </a>
                <a
                  href="/rooms"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-blue-800"
                >
                  Rooms
                </a>
                <a
                  href="/gallery"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-blue-800"
                >
                  Gallery
                </a>
                <a
                  href="/faq"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-blue-800"
                >
                  FAQs
                </a>
              </div>

              <div className="py-6">
                {user ? (
                  <>
                    <button
                      onClick={() => router.push("/myprofile")}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-black hover:bg-gray-200"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-black hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-black hover:bg-gray-200"
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
