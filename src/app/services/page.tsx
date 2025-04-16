"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    id: 'service1',
    title: 'Private Theatre',
    description:
      'Experience an exclusive cinematic journey with our Private Theatre. Perfect for celebrations or cozy movie nights, our theatre provides the ideal backdrop for unforgettable moments. Enjoy top-notch services in a setting designed for comfort and privacy.',
    imageSrc: '/Images/1.webp',
  },
  {
    id: 'service2',
    title: 'Anniversaries',
    description:
      'Celebrate your love story in style with our Anniversary packages. Our Private Theatre offers a unique setting for marking milestones with intimate screenings and luxurious surroundings. Make your anniversary unforgettable with a memorable cinematic experience.',
    imageSrc: '/Images/anniversaryshow.jpg',
  },
  {
    id: 'service3',
    title: 'Birthdays',
    description:
      'Transform your birthday into a blockbuster event with our Private Theatre. Host a private screening of your favorite films or a themed party for friends and family. Our theatre creates a festive atmosphere that ensures your special day is celebrated in a grand and unique way.',
    imageSrc: '/Images/bdayshow.jpg',
  },
  {
    id: 'service4',
    title: 'Surprises',
    description:
      'Plan the perfect surprise with our Private Theatre. From surprise parties to secret screenings, our venue is ideal for creating memorable moments that will leave your guests in awe. Make your next surprise event extraordinary with a personal touch and exclusive service.',
    imageSrc: '/Images/babyshower.jpg',
  },
  {
    id: 'service5',
    title: "Kids' Celebrations",
    description:
      "Bring magic to your child's special day with our Kids' Celebration packages. Our Private Theatre offers a fun-filled environment for birthday parties, movie marathons, and more. With kid-friendly amenities and a space designed for joy, it’s the perfect place to make their day unforgettable.",
    imageSrc: '/Images/kidscelebration.jpg',
  },
  {
    id: 'service6',
    title: 'Magicians',
    description:
      'Enchant your guests with our Magician events in the Private Theatre. Whether it’s a magic show or interactive entertainment, our theatre provides a captivating setting for spellbinding performances. Create a magical experience with professional entertainment in a unique venue.',
    imageSrc: '/Images/magician.jpg',
  },
  {
    id: 'service7',
    title: 'Tattoo Artists',
    description:
      'Host a tattoo-themed event at our Private Theatre. Ideal for tattoo conventions, exhibitions, or special presentations, our theatre offers a unique space for creativity and artistry. Elevate your event with exclusive amenities and make your event unforgettable.',
    imageSrc: '/Images/tattoartist.jpg',
  },
];

const ServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Discover Our Services
      </h1>

      {/* Service Sections */}
      {services.map((service, index) => (
        <div
          key={service.id}
          className={`w-full max-w-4xl mx-auto flex flex-col md:flex-row ${
            index % 2 !== 0 ? 'md:flex-row-reverse' : ''
          } items-start mb-12 bg-white rounded-lg shadow-md overflow-hidden`}
        >
          {/* Service Image */}
          <div className="md:w-1/2 mb-4 md:mb-0 flex justify-center items-center">
            <Image
              src={service.imageSrc}
              alt={service.title}
              width={350}
              height={280}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>

          {/* Service Info */}
          <div className="md:w-1/2 p-6 sm:p-8 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              {service.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
              {service.description}
            </p>

            {/* Book Now Button */}
            <div className="flex justify-center md:justify-start">
              <Link href="/booking">
                <button className="bg-red-500 text-white py-2 px-6 rounded-full shadow hover:bg-red-600 transition">
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

export default ServicesPage;
