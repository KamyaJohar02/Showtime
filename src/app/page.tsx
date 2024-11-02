// src/app/page.tsx

"use client"; // Ensure this component is a client component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Trending from '@/components/trending'; // Ensure correct import path
import TopPage from '@/components/toppage'; // Ensure correct import path
import RoomCards from '@/components/rooms'; // Ensure correct import path
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);

  const imagePaths = [5, 14, 3, 4, 13]; // Ensure these are correct image indices
  const totalSlides = imagePaths.length;
  const textToDisplay = "What are you waiting for? Book now and indulge in the ultimate luxury experience, tailored just for you.";

  // Carousel image switching logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Letter-by-letter text animation
  useEffect(() => {
    if (letterIndex < textToDisplay.length) {
      const textInterval = setInterval(() => {
        setDisplayedText((prev) => prev + textToDisplay[letterIndex]);
        setLetterIndex((prev) => prev + 1);
      }, 100); // Speed of text display

      return () => clearInterval(textInterval);
    } else {
      const resetTimeout = setTimeout(() => {
        setDisplayedText('');
        setLetterIndex(0);
      }, 5000); // Wait for 5 seconds before resetting

      return () => clearTimeout(resetTimeout);
    }
  }, [letterIndex]);

  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      {/* Top Page Section */}
      <section className="w-full mb-10">
        <TopPage />
      </section>

      {/* Rooms Section */}
      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-lg">
        <RoomCards />
      </section>

      {/* Trending Section */}
      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-lg">
        <Trending />
      </section>

      {/* Description Section */}
      <section className="max-w-7xl mx-auto p-2">
        <h2 className="text-6xl font-[Great Vibes] italic text-center text-gray-600 mb-5 mt-4 font-serif ">
          Where every life moment becomes an experience
        </h2>
        
      </section>

      {/* Carousel Section with Animated Text */}
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
          className="w-full h-full brightness-50"
        />
      </div>
          ))}

          {/* Updated Text Overlay with Padding and Centering Adjustments */}
          <div className="absolute top-16 left-8 right-12 w-full h-1/2 flex items-start justify-start">
            <h2 className="text-yellow-400 text-7xl md:text-10xl font-[Great Vibes] italic text-left pl-2 pr-6 pt-4 leading-snug font-serif text-outline">
              {displayedText}
            </h2>
          </div>
        </div>
      </section>

      {/* Book Now Button */}
      <section className="flex mt-0 justify-center w-full px-12 bg-red-800">
  <Link href="/booking" passHref legacyBehavior>
    <a className="bg-red-800 text-white py-4 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300 text-center">
      Book Now
    </a>
  </Link>
</section>

      {/* WhatsApp Floating Icon */}
      <a
        href="https://wa.me/919911825047"
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg bg-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/Images/Whatsapp.png" alt="WhatsApp" width={40} height={40} />
      </a>
    </main>
  );
}
