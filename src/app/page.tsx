// src/app/page.tsx

"use client"; // Ensure this component is a client component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Trending from '@/components/trending'; // Ensure correct import path
import TopPage from '@/components/toppage'; // Ensure correct import path
import RoomCards from '@/components/rooms'; // Ensure correct import path
import Link from 'next/link';
import { db } from "@/firebaseConfig"; // Import Firebase Firestore configuration
import { collection, addDoc } from "firebase/firestore"; // To interact with Firestore

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);

  const imagePaths = [5, 14, 3, 4, 13]; // Ensure these are correct image indices
  const totalSlides = imagePaths.length;
  const textToDisplay = "What are you waiting for? Book now and indulge in the ultimate luxury experience, tailored just for you.";

  // Carousel image switching logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Letter-by-letter text animation
  useEffect(() => {
    if (letterIndex < textToDisplay.length) {
      const textInterval = setInterval(() => {
        setDisplayedText((prev) => prev + textToDisplay[letterIndex]);
        setLetterIndex((prev) => prev + 1);
      }, 100); // Speed of text display

      return () => clearInterval(textInterval);
    } else {
      const resetTimeout = setTimeout(() => {
        setDisplayedText('');
        setLetterIndex(0);
      }, 5000); // Wait for 5 seconds before resetting

      return () => clearTimeout(resetTimeout);
    }
  }, [letterIndex]);

  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      {/* Top Page Section */}
      <section className="w-full mb-10">
        <TopPage />
      </section>

      {/* Rooms Section */}
      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-lg">
        <RoomCards />
      </section>

      {/* Trending Section */}
      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-lg">
        <Trending />
      </section>

      {/* Description Section */}
      <section className="max-w-7xl mx-auto p-2">
        <h2 className="text-6xl font-[Great Vibes] italic text-center text-gray-600 mb-5 mt-4 font-serif ">
          Where every life moment becomes an experience
        </h2>
        
      </section>

      {/* Carousel Section with Animated Text */}
      <section className="w-full relative">
  <div className="h-96 sm:h-screen w-full overflow-hidden relative bg-transparent">
    {imagePaths.map((index, slideIndex) => (
      <div
        key={index}
        className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
          slideIndex === currentSlide ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transform: `translateX(${100 * (slideIndex - currentSlide)}%)` }}
      >
        <Image
          src={`/Images/${index}.webp`} // Verify these paths and file extensions
          alt={`Carousel Image ${index}`}
          layout="fill"
          style={{ objectFit: 'cover' }}
          className="w-full h-full brightness-50"
        />
      </div>
          ))}

          {/* Updated Text Overlay with Padding and Centering Adjustments */}
          <div className="absolute top-16 left-8 right-12 w-full h-1/2 flex items-start justify-start">
            <h2 className="text-yellow-400 text-7xl md:text-10xl font-[Great Vibes] italic text-left pl-2 pr-6 pt-4 leading-snug font-serif text-outline">
              {displayedText}
            </h2>
          </div>
        </div>
      </section>

      {/* Book Now Button */}
      <section className="flex mt-0 justify-center w-full px-12 bg-red-800">
  <Link href="/booking" passHref legacyBehavior>
    <a className="bg-red-800 text-white py-4 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300 text-center">
      Book Now
    </a>
  </Link>
</section>

{/* Queries Section */}
{/* Queries Section */}
<section className="flex flex-col md:flex-row justify-between items-center w-full px-0 bg-gray-100 py-8">
  <div className="w-full md:w-1/2 px-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      Have any Queries? Reach out and get a call back from Showtime!
    </h2>
    <form
      className="bg-white shadow-md rounded-lg px-8 py-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement; // Cast `e.target` to `HTMLFormElement`
        const formData = new FormData(form);

        const name = formData.get("name") as string;
        const mobile = formData.get("mobile") as string;
        const query = formData.get("query") as string;

        if (!name || !mobile || !query) {
          alert("Please fill all the fields.");
          return;
        }

        try {
          // Add the query data to Firestore
          const docRef = await addDoc(collection(db, "queries"), {
            name,
            mobile,
            query,
          });

          alert("Your query has been submitted successfully!");
          console.log("Document written with ID: ", docRef.id);
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("There was an error submitting your query. Please try again.");
        }

        // Reset the form
        form.reset();
      }}
    >
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-600"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="mobile"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-600"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="query"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Your Query
        </label>
        <textarea
          id="query"
          name="query"
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-600"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-red-800 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
      >
        Submit
      </button>
    </form>
  </div>
  <div className="w-full md:w-1/2 px-6 mt-8 md:mt-0">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509684!2d-122.41941518468165!3d37.77492977975927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085814d9a0f3fd7%3A0x58c88b9f53e77cf9!2sShowtime!5e0!3m2!1sen!2sus!4v1617468395464!5m2!1sen!2sus"
      width="100%"
      height="300"
      style={{ border: 0 }}
      allowFullScreen={false}
      loading="lazy"
      className="rounded-lg shadow-md"
      title="Google Map"
    ></iframe>
  </div>
</section>



      {/* WhatsApp Floating Icon */}
      <a
        href="https://wa.me/919911825047"
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg bg-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/Images/Whatsapp.png" alt="WhatsApp" width={40} height={40} />
      </a>
    </main>
  );
}
