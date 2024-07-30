



// src/app/page.tsx

"use client"; // Ensure this component is a client component

import { useRouter } from 'next/navigation'; // Import useRouter from next/router
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { trending_data } from '../../Data/trending'; // Adjust path as necessary
import Slider from "react-slick"; // Import react-slick for carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const router = useRouter(); // Use router from Next.js
  const [currentSlide, setCurrentSlide] = useState(0); // Manage carousel slide state
  const totalSlides = [5, 14, 3, 4, 13].length; // Total number of slides

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [totalSlides]);

  const handleBookNowClick = () => {
    router.push("/Booking"); // Navigate to booking page
  };

  // Slider settings for trending carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 slides at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true, // Enable arrows
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Trending Section */}
      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-t-lg">
        <Slider {...settings}>
          {trending_data.map((item) => (
            <div key={item.id} className="trending-item">
              <div className="trending-image-container">
                <Image
                  src={item.src} // Ensure the src is from a configured domain
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="trending-image"
                />
              </div>
              <div className="trending-info">
                <h3>{item.title}</h3>
                <p>{item.location}</p>
                <span>{item.description}</span>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <section className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-5xl">Where every life moment becomes an experience</h2>
        <h3 className="font-bold text-xl py-5">
          Book your personal movie theatre for celebrating your life events and much more...
        </h3>
      </section>

      {/* Carousel Section */}
      <section className="w-full relative">
        <div className="h-96 sm:h-screen w-full overflow-hidden relative bg-transparent">
          {[5, 14, 3, 4, 13].map((index, slideIndex) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
                slideIndex === currentSlide ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ transform: `translateX(${100 * (slideIndex - currentSlide)}%)` }}
            >
              <Image
                src={`/Images/${index}.webp`}
                alt={`Carousel Image ${index}`}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Book Now Button */}
      <section className="flex mt-4 justify-end w-full px-6">
        <button
          onClick={handleBookNowClick}
          className="bg-red-600 text-white py-2 px-4 rounded-full"
        >
          Book Now
        </button>
      </section>

      {/* WhatsApp Floating Icon */}
      <a
        href="https://wa.me/919911825047" // Replace with your WhatsApp number
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/Images/Whatsapp.png" // Ensure the path to your WhatsApp icon
          alt="WhatsApp"
          width={40}
          height={40}
        />
      </a>
    </main>
  );
}
