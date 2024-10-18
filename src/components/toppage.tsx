import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const images = [
  '/Images/c1.jpg', // Ensure the paths are correct
  '/Images/3.webp',
  '/Images/5.webp',
]; // Array of images for the carousel

const textToDisplay = "Celebrate life’s special moments in style with Showtime"; // Updated text

const TopPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);

  // Handle vertical image carousel transition
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(slideInterval);
  }, []);

  // Handle letter-by-letter text display and reset after 5 seconds
  useEffect(() => {
    if (letterIndex < textToDisplay.length) {
      const textInterval = setInterval(() => {
        setDisplayedText((prev) => prev + textToDisplay[letterIndex]);
        setLetterIndex((prev) => prev + 1);
      }, 150); // Slower letter change (150ms)

      return () => clearInterval(textInterval);
    } else {
      const resetTimeout = setTimeout(() => {
        setDisplayedText('');
        setLetterIndex(0);
      }, 5000); // Pause for 5 seconds before restarting

      return () => clearTimeout(resetTimeout);
    }
  }, [letterIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden mt-0">
      {/* Vertical Image Carousel */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
              index === currentSlide ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ transform: `translateY(${100 * (index - currentSlide)}%)` }}
          >
            <Image
              src={image}
              alt={`Carousel Image ${index}`}
              layout="fill"
              style={{ objectFit: 'cover' }}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-start bg-black bg-opacity-50 pt-20">
        <h2 className="text-white text-6xl md:text-8xl font-serif font-bold text-center mb-6 h-1/2 flex items-center justify-center">
          {displayedText}
        </h2>
        <Link href="/booking">
          <button className="bg-red-500 text-white py-3 px-8 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TopPage;
