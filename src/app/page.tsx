"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import "./globals.css";
import { trending_data } from "../../Data/trending";
import Link  from "next/link";
// import { useRouter } from "next/router";

export default function Home() {
  // const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = [5, 14, 3, 4, 13].length;
 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000); // Change slide every 3 seconds

    

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [totalSlides]);
  

  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Trending Section */}
      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-t-lg">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols- gap-4 py-5">
          {trending_data.map((item) => (
            <div key={item.id} className="space-y-1 cursor-pointer text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
                <Image
                  src={item.src} // Ensure the src is from a configured domain
                  alt={item.title}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <p className="font-bold">{item.title}</p>
              <p>{item.location}</p>
              <p className="font-light text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-5xl">Where every life moment becomes an experience</h2>
        <h3 className="font-bold text-xl py-5">
          Book your personal movie theatre for celebrating your life events and much more...
        </h3>
      </section>
   
      {/* Carousel Section */}
      <section className="w-full relative">
        <div className="h-96 sm:h-screen w-full overflow-hidden relative bg-transparent">
          {[5, 14, 3, 4, 13].map((index, slideIndex) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
                slideIndex === currentSlide ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ transform: `translateX(${100 * (slideIndex - currentSlide)}%)` }}
            >
              <Image
                src={`/Images/${index}.webp`}
                alt={`Carousel Image ${index}`}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Book Now Button */}
      <section className="flex mt-4 justify-end w-full px-6">
      <Link href="/Booking">
          <Button className="bg-red-600 text-white py-2 px-4 rounded-full">
            Book Now
          </Button>
        </Link>
      </section>

      {/* WhatsApp Floating Icon */}
      <a
        href="https://wa.me/9911825047" // Replace with your WhatsApp number
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/Images/Whatsapp.png" // Ensure the path to your WhatsApp icon
          alt="WhatsApp"
          width={40}
          height={40}
        />
      </a>
    </main>
  );
}
