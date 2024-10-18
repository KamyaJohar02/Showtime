import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Image from 'next/image';

export const trending_data = [
  {
    id: 1,
    src: "/Images/1.webp",
    title: "Private Theatre",
    description: "Experience an exclusive cinematic journey with our Private Theatre. Whether it’s a special celebration or a cozy movie night, our theatre provides the perfect backdrop for unforgettable moments. Enjoy top-notch services in a setting designed for comfort and privacy.",
    width: 500,
    height: 500,
  },
  {
    id: 2,
    src: "/Images/anniversaryshow.jpg",
    title: "Anniversaries",
    description: "Celebrate your love story in style with our Anniversary packages. Our Private Theatre offers a unique setting for marking milestones with intimate screenings and luxurious surroundings. Make your anniversary unforgettable with a memorable cinematic experience.",
    width: 500,
    height: 500,
  },
  {
    id: 3,
    src: "/Images/bdayshow.jpg",
    title: "Birthdays",
    description: "Transform your birthday into a blockbuster event with our Private Theatre. Host a private screening of your favorite films or a themed party for friends and family. Our theatre creates a festive atmosphere that ensures your special day is celebrated in a grand and unique way.",
    width: 500,
    height: 500,
  },
  {
    id: 4,
    src: "/Images/babyshower.jpg",
    title: "Surprises",
    description: "Plan the perfect surprise with our Private Theatre. From surprise parties to secret screenings, our venue is ideal for creating memorable moments that will leave your guests in awe. Make your next surprise event extraordinary with a personal touch and exclusive service.",
    width: 500,
    height: 500,
  },
  {
    id: 5,
    src: "/Images/kidscelebration.jpg",
    title: "Kids' Celebrations",
    description: "Bring magic to your child's special day with our Kids' Celebration packages. Our Private Theatre offers a fun-filled environment for birthday parties, movie marathons, and more. With kid-friendly amenities and a space designed for joy, it’s the perfect place to make their day unforgettable.",
    width: 500,
    height: 500,
  },
  {
    id: 6,
    src: "/Images/magician.jpg",
    title: "Magicians",
    description: "Enchant your guests with our Magician events in the Private Theatre. Whether it’s a magic show or interactive entertainment, our theatre provides a captivating setting for spellbinding performances. Create a magical experience with professional entertainment in a unique venue.",
    width: 500,
    height: 500,
  },
  {
    id: 7,
    src: "/Images/tattoartist.jpg",
    title: "Tattoo Artists",
    description: "Host a tattoo-themed event at our Private Theatre. Ideal for tattoo conventions, exhibitions, or special presentations, our theatre offers a unique space for creativity and artistry. Elevate your event with exclusive amenities and make your event unforgettable",
    width: 500,
    height: 500,
  },
];

const Trending: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: false,
    centerPadding: '0px',
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="relative w-full px-5 py-10 box-border">
      <h2 className="text-6xl font-[Great Vibes] italic text-center text-gray-600 mb-10 font-serif">
  What We Offer
</h2>
      <Slider {...settings}>
        {trending_data.map((item) => (
          <div
            key={item.id}
            className="relative bg-white rounded-lg overflow-hidden shadow-md p-6 mx-3 my-4 transition-transform duration-300 ease-in-out transform hover:translate-y-[-10px] hover:shadow-lg"
            style={{ height: '550px' }} // Set a constant height for all cards
          >
            <div className="w-44 h-44 mx-auto mb-4 relative overflow-hidden rounded-full border-3 border-gray-300 shadow-sm">
              <Image
                src={item.src}
                alt={item.title}
                width={item.width}
                height={item.height}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left px-10 py-4">
              {/* Center-aligned title */}
              <h3 className="text-lg font-bold mb-4 text-center">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p> {/* Left-aligned description */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Custom Next Arrow
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-next`}
      style={{ ...style, display: 'block', background: '#FFFFFF', right: '-40px', zIndex: '2', width: '60px', height: '60px', borderRadius: '50%' }} // Changed size to 60px
      onClick={onClick}
    >
      <svg
        className="w-8 h-8 text-gray-600 mx-auto" // Increased icon size to w-8 h-8
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

// Custom Prev Arrow
const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-prev`}
      style={{ ...style, display: 'block', background: '#FFFFFF', left: '-40px', zIndex: '2', width: '60px', height: '60px', borderRadius: '50%' }} // Changed size to 60px
      onClick={onClick}
    >
      <svg
        className="w-8 h-8 text-gray-600 mx-auto" // Increased icon size to w-8 h-8
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
};

export default Trending;
