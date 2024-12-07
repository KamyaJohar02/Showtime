import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Trending: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-0">
      <h2 className="text-6xl font-[Great Vibes] italic text-center text-gray-600 mb-10 font-serif">
        Discover Our Services
      </h2>

      {/* Responsive Image that links to /services */}
      <Link href="/services" passHref>
        <div className="relative mx-auto w-full max-w-3xl cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105">
          <Image
            src="/Images/services.jpg"
            alt="Discover Our Services"
            layout="responsive"
            width={1200} // Adjust width and height for desired aspect ratio
            height={400} // Reduced height for lower aspect ratio
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      </Link>
    </div>
  );
};

export default Trending;
