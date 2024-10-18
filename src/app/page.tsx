// src/app/page.tsx

"use client"; // Ensure this component is a client component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Trending from '@/components/trending'; // Ensure correct import path
import TopPage from '@/components/toppage'; // Ensure correct import path
import RoomCards from '@/components/rooms'; // Ensure correct import path

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

  const handleBookNowClick = () => {
    router.push('/booking');
  };

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
      <section className="mx-auto max-w-7xl mt-0 p-2 bg-white rounded-t-lg">
        <Trending />
      </section>

      {/* Description Section */}
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="font-[Great Vibes] italic text-5xl text-gray-600 ">
          Where every life moment becomes an experience
        </h2>
        <h3 className="font-[Great Vibes] italic text-2xl py-5 text-gray-600">
          Book your personal movie theatre for celebrating your life events and much more...
        </h3>
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
                className="w-full h-full"
              />
            </div>
          ))}

          {/* Updated Text Overlay with Padding and Centering Adjustments */}
          <div className="absolute top-16 left-8 right-12 w-full h-1/2 flex items-start justify-start">
            <h2 className="text-white text-4xl md:text-7xl font-bold text-left pl-2 pr-6 pt-4 leading-snug">
              {displayedText}
            </h2>
          </div>
        </div>
      </section>

      {/* Book Now Button */}
      <section className="flex mt-0 justify-center w-full px-12 bg-red-800">
        <button
          onClick={handleBookNowClick}
          className="bg-red-800 text-white py-4 px-4 rounded-full"
        >
          Book Now
        </button>
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
