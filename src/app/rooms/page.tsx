import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const rooms = [
  {
    id: 'room1',
    title: 'Luxurious Private Suite',
    description:
      'A spacious private suite designed for ultimate relaxation. Enjoy top-notch amenities and a serene environment.',
    imageSrc: '/Images/Room1.jpg',
    moreInfoLink: '/rooms/room1',
  },
  {
    id: 'room2',
    title: 'Cozy Family Room',
    description:
      'Perfect for families, this room features ample space, a cozy setting, and modern comforts to make your stay memorable.',
    imageSrc: '/Images/Room2.jpg',
    moreInfoLink: '/rooms/room2',
  },
  {
    id: 'room3',
    title: 'Elegant Conference Hall',
    description:
      'Ideal for meetings and conferences, our elegant hall is equipped with state-of-the-art technology and flexible seating.',
    imageSrc: '/Images/Room3.jpg',
    moreInfoLink: '/rooms/room3',
  },
];

const RoomsPage: React.FC = () => {
  return (
    <div
      className="relative min-h-screen w-full p-6 sm:p-10 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/Images/stone3.jpg')", // Background image for the entire page
      }}
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Page Content */}
      <div className="relative z-10 text-white">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-[Great Vibes] italic text-center text-green-900 font-serif mb-4 sm:mb-6 text-outline">
          Explore Our Rooms
        </h1>

        {/* Room Sections */}
        {rooms.map((room, index) => (
          <div
            key={room.id}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? 'md:flex-row-reverse' : ''
            } items-start mb-8 sm:mb-10 bg-opacity-70 bg-[#093024] rounded-lg p-4 sm:p-6 md:p-8`}
          >
            {/* Room Image */}
            <div className="md:w-1/2 mb-4 md:mb-0">
              <Image
                src={room.imageSrc}
                alt={room.title}
                width={700}
                height={500}
                className="rounded-lg object-cover"
              />
            </div>

            {/* Room Info */}
            <div className="md:w-1/2 px-4 sm:px-6 md:px-10 flex flex-col text-center md:text-left">
              <div className="mb-6 sm:mb-10 px-2 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 mt-2 sm:mt-3">{room.title}</h2>
                <p className="text-sm sm:text-lg text-gray-300 mb-6">{room.description}</p>
              </div>

              {/* Buttons Section */}
              <div className="mt-auto flex justify-center md:justify-start space-x-4">
                <Link href={room.moreInfoLink}>
                  <button className="w-full sm:w-auto bg-red-500 text-white py-2 px-4 sm:px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
                    More Info
                  </button>
                </Link>
                <Link href="/booking">
                  <button className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 sm:px-6 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
