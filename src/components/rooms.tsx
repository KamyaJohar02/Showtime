import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const rooms = [
  {
    id: 1,
    title: "Luxurious Private Suite",
    description: "A spacious private suite designed for ultimate relaxation. Enjoy top-notch amenities and a serene environment.",
    images: ["/Images/room1.jpg", "/Images/room2.jpg", "/Images/room3.jpg"],
    moreInfoLink: "/rooms/room1",
  },
  {
    id: 2,
    title: "Cozy Family Room",
    description: "Perfect for families, this room features ample space, a cozy setting, and modern comforts to make your stay memorable.",
    images: ["/Images/room2.jpg", "/Images/room2.jpg", "/Images/room2.jpg"],
    moreInfoLink: "/rooms/room2",
  },
  {
    id: 3,
    title: "Elegant Conference Hall",
    description: "Ideal for meetings and conferences, our elegant hall is equipped with state-of-the-art technology and flexible seating.",
    images: ["/Images/room3.jpg", "/Images/room3.jpg", "/Images/room3.jpg"],
    moreInfoLink: "/rooms/room3",
  },
];

const RoomCards: React.FC = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
  };

  return (
    <div className="relative w-full px-5 pt-0 pb-3 bg-white">
      <h2 className="text-6xl font-[Great Vibes] italic text-center text-gray-600 mb-10 font-serif">
        Explore Our Rooms
      </h2>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            {/* Room Image Carousel */}
            <div className="relative w-full h-64">
              <Slider {...sliderSettings}>
                {room.images.map((image, index) => (
                  <div key={index} className="relative w-full h-64">
                    <Image
                      src={image}
                      alt={`${room.title} - image ${index + 1}`}
                      layout="fill"
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Room Details */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{room.title}</h3>
              <p className="text-gray-600 mb-6 text-center">{room.description}</p>

              {/* More Info Button */}
              <div className="flex justify-center">
                <Link href={room.moreInfoLink} legacyBehavior>
                  <a className="bg-red-500 text-white py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
                    More Info
                  </a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomCards;
