import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Room3Page: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Full Container Room Image */}
      <div className="relative w-full h-[80vh]">
        <Image
          src="/Images/Room3.jpg" // Replace with the actual image path
          alt="Elegant Conference Hall"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Room Information Section */}
      <div className="px-10 py-6">
        <h1 className="text-5xl font-bold text-center mb-6">Elegant Conference Hall</h1>
        <p className="text-lg text-gray-700 text-center">
          Ideal for meetings and conferences, our elegant hall is equipped with state-of-the-art technology and flexible
          seating.
        </p>
      </div>

      {/* Floating Book Now Button */}
      <Link href="/booking">
        <button className="fixed bottom-10 right-10 bg-red-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
          Book Now
        </button>
      </Link>
    </div>
  );
};

export default Room3Page;
