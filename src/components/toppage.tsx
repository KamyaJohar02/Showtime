'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({
  weight: '700',
  subsets: ['latin'],
});

const images = [
  '/Images/wonders2.jpg',
  '/Images/sweetroom.jpg',
  '/Images/galaxy2.jpg',
  '/Images/sweet2.jpg',
];

const textToDisplay = "Celebrate your special moments in style with Showtime";

const TopPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);

  // Auto-slide image carousel
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // Typewriter effect for text
  useEffect(() => {
    if (letterIndex < textToDisplay.length) {
      const textInterval = setInterval(() => {
        setDisplayedText((prev) => prev + textToDisplay[letterIndex]);
        setLetterIndex((prev) => prev + 1);
      }, 150);
      return () => clearInterval(textInterval);
    } else {
      const resetTimeout = setTimeout(() => {
        setDisplayedText('');
        setLetterIndex(0);
      }, 5000);
      return () => clearTimeout(resetTimeout);
    }
  }, [letterIndex]);

  return (
    <>
      {/* 🔥 Gradient Marquee Ribbon */}
      <div className="w-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 overflow-hidden whitespace-nowrap py-2 z-50">
        <div className="inline-block animate-marquee text-black font-bold text-sm sm:text-base px-4">
        ⏰ Hurry! Exclusive Discount Ending Soon —   Book Now!   —
        🎉 Introductory Offer: All Rooms Now at Just ₹1499!!   —
          ⏰ Hurry! Exclusive Discount Ending Soon —   Book Now!   —
          🎉 Introductory Offer: All Rooms Now at Just ₹1499!!   -
          ⏰ Hurry! Exclusive Discount Ending Soon —   Book Now!   —
          🎉 Introductory Offer: All Rooms Now at Just ₹1499!!   -
          ⏰ Hurry! Exclusive Discount Ending Soon —   Book Now!   —
          🎉 Introductory Offer: All Rooms Now at Just ₹1499!!   -
        </div>
      </div>

      {/* 🎥 Image Carousel Section */}
      <div className="relative w-full h-[700px] overflow-hidden mt-0">
        {/* Image Slides */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Carousel Image ${index}`}
                fill
                style={{ objectFit: 'cover' }}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Overlay Text + Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
          <h2 className={`${dancingScript.className} text-yellow-500 text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-center mb-6`}>
            {displayedText}
          </h2>
          <Link href="/booking">
            <span className="bg-red-500 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-red-600 transition duration-300 text-sm sm:text-base md:text-lg cursor-pointer">
              Book Now
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopPage;
