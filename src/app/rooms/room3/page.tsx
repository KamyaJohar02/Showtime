import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Room3Page: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white">

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-12 min-h-screen">
        {/* Room Image Container */}
        <div className="w-full max-w-5xl mb-6 sm:mb-8 overflow-hidden rounded-lg shadow-lg relative">
          <Image
            src="/Images/wondersroom.jpg" // Replace with the actual room image path
            alt="Elegant Conference Hall"
            layout="responsive"
            width={500}
            height={300}
            className="rounded-lg"
          />
          {/* Dark overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
          <div className="absolute bottom-3 sm:bottom-5 left-4 sm:left-5 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            WONDER
          </div>
        </div>

        {/* Room Information Section */}
        <div className="w-full max-w-3xl bg-opacity-80 bg-[#093024] p-6 sm:p-8 rounded-lg shadow-lg text-beige text-opacity-90">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-white">
            A Professional Setting for Memorable Events
          </h2>
          <p className="text-base sm:text-lg text-gray-300 text-center mb-6 sm:mb-10">
            Designed for success, WONDER is equipped with the latest technology and flexible seating for all your event needs.
          </p>

          {/* Amenities Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 text-white">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Room Highlights</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>🖥️ HD projection system with dual screens</li>
                <li>🔊 Advanced audio-visual equipment</li>
                <li>🪑 Ergonomic seating for long events</li>
                <li>🍽️ Catering services available</li>
                <li>🖇️ Flexible room setup for various formats</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Exclusive Amenities</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>💻 High-speed internet and charging stations</li>
                <li>💼 Business lounge and breakout areas</li>
                <li>💡 Customizable lighting options</li>
                <li>📞 Dedicated support team for assistance</li>
                <li>⏱️ Extended booking options for special events</li>
              </ul>
            </div>
          </div>

          {/* Description Section */}
          <div className="text-center text-gray-300 text-sm sm:text-base">
            <p className="mb-4 sm:mb-6">
              Perfect for corporate meetings, seminars, and workshops, our conference hall offers a seamless blend of luxury and functionality.
            </p>
            <p>
              Reserve today and elevate your next business event with top-notch amenities in an elegant setting.
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

export default Room3Page;
