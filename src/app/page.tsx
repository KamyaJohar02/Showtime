// src/app/page.tsx

"use client"; // Ensure this component is a client component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Trending from '@/components/trending'; // Ensure correct import path
import TopPage from '@/components/toppage'; // Ensure correct import path

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const imagePaths = [5, 14, 3, 4, 13]; // Ensure these are correct image indices
  const totalSlides = imagePaths.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleBookNowClick = () => {
    router.push('/booking');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Top Page Section */}
      <section className="w-full mb-10">
        <TopPage />
      </section>

      {/* Trending Section */}
      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-t-lg">
        <Trending />
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
          {imagePaths.map((index, slideIndex) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
                slideIndex === currentSlide ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ transform: `translateX(${100 * (slideIndex - currentSlide)}%)` }}
            >
              <Image
                src={`/Images/${index}.webp`} // Verify these paths and file extensions
                alt={`Carousel Image ${index}`}
                layout="fill"
                style={{ objectFit: 'cover' }}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Book Now Button */}
      <section className="flex mt-4 justify-end w-full px-6">
        <button
          onClick={handleBookNowClick}
          className="bg-red-600 text-white py-2 px-4 rounded-full"
        >
          Book Now
        </button>
      </section>

      {/* WhatsApp Floating Icon */}
      <a
        href="https://wa.me/919911825047"
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/Images/Whatsapp.png" alt="WhatsApp" width={40} height={40} />
      </a>
    </main>
  );
}