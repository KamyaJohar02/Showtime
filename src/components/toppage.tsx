import React from 'react';
import Image from 'next/image';

const backgroundImage = '/Images/c1.jpg'; // Ensure this path is correct
const textToDisplay = 'Book for your special occasion with us'; // Static text

const TopPage: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
        <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-6">
          {textToDisplay}
        </h2>
        <button className="bg-red-500 text-white py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TopPage;
