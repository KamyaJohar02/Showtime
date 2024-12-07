import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const images = [
  '/Images/c1.jpg', 
  '/Images/car1_2.jpg',
  '/Images/car1_4.jpg',
];

const textToDisplay = "Celebrate your special moments in style with Showtime"; 

const TopPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

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
              fill
              style={{ objectFit: 'cover' }}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
        <h2 className="text-yellow-500 text-3xl sm:text-4xl md:text-3xl lg:text-7xl font-serif font-bold text-center mb-6 text-outline">
          {displayedText}
        </h2>
        <Link href="/booking">
          <button className="bg-red-500 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-red-600 transition duration-300 text-sm sm:text-base md:text-lg">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TopPage;
