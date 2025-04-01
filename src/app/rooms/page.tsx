"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    id: "room1",
    title: "Luxurious Private Suite",
    description:
      "A spacious private suite designed for ultimate relaxation. Enjoy top-notch amenities and a serene environment.",
    imageSrc: "/Images/Room1.jpg",
    moreInfoLink: "/rooms/room1",
  },
  {
    id: "room2",
    title: "Cozy Family Room",
    description:
      "Perfect for families, this room features ample space, a cozy setting, and modern comforts to make your stay memorable.",
    imageSrc: "/Images/Room2.jpg",
    moreInfoLink: "/rooms/room2",
  },
  {
    id: "room3",
    title: "Elegant Conference Hall",
    description:
      "Ideal for meetings and conferences, our elegant hall is equipped with state-of-the-art technology and flexible seating.",
    imageSrc: "/Images/Room3.jpg",
    moreInfoLink: "/rooms/room3",
  },
];

const RoomsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">        Explore Our Rooms
      </h1>

      {/* Room Sections */}
      {rooms.map((room, index) => (
        <div
          key={room.id}
          className={`flex flex-col md:flex-row ${
            index % 2 !== 0 ? "md:flex-row-reverse" : ""
          } items-start mb-12 bg-white rounded-lg shadow-md overflow-hidden`}
        >
          {/* Room Image */}
          <div className="md:w-1/2">
            <Image
              src={room.imageSrc}
              alt={room.title}
              width={700}
              height={500}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Room Info */}
          <div className="md:w-1/2 p-6 sm:p-8 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              {room.title}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mb-6">
              {room.description}
            </p>

            {/* Buttons Section */}
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href={room.moreInfoLink}>
                <button className="bg-red-500 text-white py-2 px-4 sm:px-6 rounded-full shadow hover:bg-red-600 transition">
                  More Info
                </button>
              </Link>
              <Link href="/booking">
                <button className="bg-blue-500 text-white py-2 px-4 sm:px-6 rounded-full shadow hover:bg-blue-600 transition">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomsPage;
