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
    <div className="w-full p-10">
      {/* Heading */}
      <h1 className="text-6xl font-[Great Vibes] italic text-center mb-10">Explore Our Rooms</h1>

      {/* Room 1 */}
      <div className="flex flex-col md:flex-row items-start mb-10 bg-gray-200">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <Image
            src={rooms[0].imageSrc}
            alt={rooms[0].title}
            width={700}
            height={500}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="md:w-1/2 px-6 flex flex-col">
          <div className="mb-10">
            <h2 className="text-5xl font-bold mb-4 mt-3">{rooms[0].title}</h2>
            <p className="text-xl text-gray-600 mb-6 mr-4">{rooms[0].description}</p>
          </div>
          {/* More Info Button */}
          <div className="mt-auto mb-2 flex justify-center">
            <Link href={rooms[0].moreInfoLink}>
              <button className="bg-red-500 text-white py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
                More Info
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Room 2 */}
      <div className="flex flex-col md:flex-row-reverse items-start mb-10 bg-gray-200">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <Image
            src={rooms[1].imageSrc}
            alt={rooms[1].title}
            width={700}
            height={500}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="md:w-1/2 px-6 flex flex-col">
          <div className="mb-10">
            <h2 className="text-5xl font-bold mb-4 mt-3">{rooms[1].title}</h2>
            <p className="text-lg text-gray-600 mb-6 mr-4">{rooms[1].description}</p>
          </div>
          {/* More Info Button */}
          <div className="mt-auto mb-2 flex justify-center">
            <Link href={rooms[1].moreInfoLink}>
              <button className="bg-red-500 text-white py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
                More Info
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Room 3 */}
      <div className="flex flex-col md:flex-row items-start mb-10 bg-gray-200">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <Image
            src={rooms[2].imageSrc}
            alt={rooms[2].title}
            width={700}
            height={500}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="md:w-1/2 px-6 flex flex-col">
          <div className="mb-10">
            <h2 className="text-5xl font-bold mb-4 mt-3">{rooms[2].title}</h2>
            <p className="text-lg text-gray-600 mb-6 mr-2">{rooms[2].description}</p>
          </div>
          {/* More Info Button */}
          <div className="mt-auto mb-2 flex justify-center">
            <Link href={rooms[2].moreInfoLink}>
              <button className="bg-red-500 text-white py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
                More Info
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
