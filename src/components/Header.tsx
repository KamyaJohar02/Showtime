"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, ChevronDownIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Popover, Transition } from "@headlessui/react";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const products =[{
    name: "FAQs",
    description: "Getter a better understanding of your traffic",
    href: "#",
    icon: HomeIcon,
  },
  {
    name: "Refund Policy",
    description: "Speak directly to your customers",
    icon: HomeIcon
  },

  ]
  return (
    <header className="bg-black">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">ShowTime</span>
            <Image
              className="h-12 w-auto"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Showtime.svg/2560px-Showtime.svg.png"
              alt="Logo"
              width={100}
              height={40}
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open Main Menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
              Learn
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-white"
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute bg-white -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl shadow-lg ring-1 ring-gray-900/5">
               
              </Popover.Panel>
            </Transition>
          </Popover>
        </Popover.Group>
      </nav>
    </header>
  );
}

export default Header;
