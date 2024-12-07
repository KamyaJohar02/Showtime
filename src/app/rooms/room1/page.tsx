import React from 'react';
import Image from 'next/image';

import Link from 'next/link';

const Room1Page: React.FC = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/Images/stone3.jpg')", // Background image for entire page
      }}
    >
      {/* Dark Overlay for Better Readability */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-12 min-h-screen">
        {/* Room Image Container */}
        <div className="w-full max-w-5xl mb-6 sm:mb-8 overflow-hidden rounded-lg shadow-lg relative">
          <Image
            src="/Images/Room1.jpg" // Replace with the actual room image path
            alt="Luxurious Private Suite"
            layout="responsive"
            width={1000}
            height={600}
            className="rounded-lg"
          />
          <div className="absolute bottom-3 sm:bottom-5 left-4 sm:left-5 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Luxurious Private Suite
          </div>
        </div>

        {/* Room Information Section */}
        <div className="w-full max-w-3xl bg-opacity-70 bg-[#093024] p-6 sm:p-8 rounded-lg shadow-lg text-beige text-opacity-90">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-white">
            Welcome to Your Private Theatre Experience
          </h2>
          <p className="text-base sm:text-lg text-gray-300 text-center mb-6 sm:mb-10">
            Experience the ultimate in comfort and exclusivity in our Luxurious Private Suite, designed to provide an intimate and immersive cinematic escape.
          </p>

          {/* Amenities Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 text-white">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Room Highlights</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>🎥 150-inch 4K Ultra HD screen with surround sound</li>
                <li>🛋️ Plush recliners with individual controls</li>
                <li>🍿 Personalized snack and beverage menu</li>
                <li>📱 Smart room controls for lighting and sound</li>
                <li>🎶 State-of-the-art acoustics for an unforgettable experience</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Exclusive Amenities</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>💼 Complimentary Wi-Fi and charging stations</li>
                <li>🥂 Private lounge area for pre-show relaxation</li>
                <li>🧴 Luxurious washroom facilities</li>
                <li>👥 Personal concierge service for all requests</li>
                <li>🕰️ Extended booking options for full privacy</li>
              </ul>
            </div>
          </div>

          {/* Additional Description */}
          <div className="text-center text-gray-300 text-sm sm:text-base">
            <p className="mb-4 sm:mb-6">
              Perfect for birthdays, anniversaries, and intimate gatherings, this suite is equipped to meet all your entertainment desires with utmost privacy and exclusivity.
            </p>
            <p>
              Book now and step into a realm of luxury where every detail is curated to deliver a truly personalized experience. Escape from the ordinary and immerse yourself in cinematic grandeur.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Book Now Button */}
      <Link href="/booking">
        <button className="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 bg-red-500 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg hover:bg-red-600 transition duration-300 z-20">
          Book Now
        </button>
      </Link>
    </div>
  );
};

export default Room1Page;
