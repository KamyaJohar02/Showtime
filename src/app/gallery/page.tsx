"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const images = [
  "/Images/Room1.jpg",
  "/Images/Room2.jpg",
  "/Images/Room3.jpg",
];

const GalleryPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Gallery</h1>
      <div className="relative w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full object-cover"
          width={500}
          height={400}
        />
        {/* Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
        >
          &#8592;
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default GalleryPage;
