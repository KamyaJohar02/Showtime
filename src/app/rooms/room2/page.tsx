import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Room2Page: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white">

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-12 min-h-screen">
        {/* Room Image Container */}
        <div className="w-full max-w-5xl mb-6 sm:mb-8 overflow-hidden rounded-lg shadow-lg relative">
          <Image
            src="/Images/Room2.jpg" // Replace with the actual room image path
            alt="Cozy Family Room"
            layout="responsive"
            width={1000}
            height={600}
            className="rounded-lg"
          />
          {/* Dark overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
          <div className="absolute bottom-3 sm:bottom-5 left-4 sm:left-5 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            GALAXY
          </div>
        </div>

        {/* Room Information Section */}
        <div className="w-full max-w-3xl bg-opacity-70 bg-[#093024] p-6 sm:p-8 rounded-lg shadow-lg text-beige text-opacity-90">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-white">
            Your Perfect Family Getaway
          </h2>
          <p className="text-base sm:text-lg text-gray-300 text-center mb-6 sm:mb-10">
            GALAXY offers ample space and comfort, designed to make your stay with loved ones truly memorable.
          </p>

          {/* Amenities Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 text-white">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Room Highlights</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>🛋️ Spacious family-friendly seating arrangement</li>
                <li>📺 Large HD screen for family entertainment</li>
                <li>🍲 In-room dining options with kids’ menu</li>
                <li>🌞 Natural lighting with blackout curtains</li>
                <li>🏡 Homey, warm décor for a relaxing ambiance</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Exclusive Amenities</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>📶 High-speed Wi-Fi for all devices</li>
                <li>👨‍👩‍👧 Family concierge services available</li>
                <li>🧸 Special amenities for children</li>
                <li>🚿 Modern washroom facilities</li>
                <li>🛌 Extra bedding options upon request</li>
              </ul>
            </div>
          </div>

          {/* Description Section */}
          <div className="text-center text-gray-300 text-sm sm:text-base">
            <p className="mb-4 sm:mb-6">
              The ideal setting for family gatherings and making precious memories, this room provides the warmth and coziness you seek.
            </p>
            <p>
              Book now for a memorable family experience, complete with amenities that cater to guests of all ages.
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

export default Room2Page;
