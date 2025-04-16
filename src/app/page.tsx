"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Trending from '@/components/trending';
import TopPage from '@/components/toppage';
import RoomCards from '@/components/rooms';
import Link from 'next/link';
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);

  const imagePaths = [5, 14, 3, 4, 13];
  const totalSlides = imagePaths.length;
  const textToDisplay = "What are you waiting for? Book now and indulge in the ultimate luxury experience, tailored just for you.";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (letterIndex < textToDisplay.length) {
      const textInterval = setInterval(() => {
        setDisplayedText((prev) => prev + textToDisplay[letterIndex]);
        setLetterIndex((prev) => prev + 1);
      }, 100);
      return () => clearInterval(textInterval);
    } else {
      const resetTimeout = setTimeout(() => {
        setDisplayedText('');
        setLetterIndex(0);
      }, 5000);
      return () => clearTimeout(resetTimeout);
    }
  }, [letterIndex]);

  const services = [
    { title: 'Private Screening', image: '/Images/screening7.jpg' },
    { title: 'Snacks And Beverages', image: '/Images/snacks4.jpg' },
    { title: 'Bouquets', image: '/Images/Bouquet2.webp' },
    { title: 'Gifts', image: '/Images/gifts3.avif' },
    { title: 'Decorations', image: '/Images/decoration6.jpg' },
    { title: 'Cakes', image: '/Images/cakes5.webp' },
    { title: 'Photoshoot', image: '/Images/photoshoot1.jpeg' },
    { title: 'Surprise Events', image: '/Images/surprise.webp' },
    { title: 'Private Parties', image: '/Images/privatep.JPG' },
    { title: 'Anniversaries', image: '/Images/anniversary1.JPG' },
    { title: 'Birthdays', image: '/Images/birthday3.JPG' },
    { title: 'Corporate Events', image: '/Images/corporate1.JPG' },
    { title: 'Engagements', image: '/Images/engagement.JPEG' },

  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      <section className="w-full mb-10">
        <TopPage />
      </section>

      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-lg">
        <RoomCards />
      </section>

      <section className="mx-auto max-w-7xl mt-0 p-6 bg-white rounded-lg">
        <Trending />
      </section>

      <section className="max-w-7xl mx-auto p-2">
        <h2 className="text-6xl font-[Great Vibes] italic text-center text-red-600 mb-5 mt-4 font-serif">
          Where every life moment becomes an experience
        </h2>
      </section>

      {/* <section className="w-full relative">
        <div className="h-96 sm:h-screen w-full overflow-hidden relative bg-transparent">
          {imagePaths.map((index, slideIndex) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(${100 * (slideIndex - currentSlide)}%)`,
              }}
            >
              <Image
                src={`/Images/${index}.webp`}
                alt={`Carousel Image ${index}`}
                fill
                className="w-full h-full object-cover brightness-50"
              />
            </div>
          ))}
          <div className="absolute top-16 left-8 right-12 w-full h-1/2 flex items-start justify-start">
            <h2 className="text-yellow-400 text-7xl md:text-10xl font-[Great Vibes] italic text-left pl-2 pr-6 pt-4 leading-snug font-serif">
              {displayedText}
            </h2>
          </div>
        </div>
      </section> */}

      

      <section className="w-full bg-white py-10 px-4">
        {/* <h2 className="text-4xl font-bold text-center mb-8">Our Services</h2> */}
        <div className="overflow-hidden max-w-6xl mx-auto">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {services.concat(services).map((service, index) => (
              <div key={index} className="w-1/4 px-2 flex-shrink-0">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-64"
                  />
                  <div className="text-center py-3 bg-gray-800 text-white font-semibold text-lg">
                    {service.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex mt-2 justify-center w-full px-12 ">
        <Link href="/booking" passHref legacyBehavior>
          <a className="bg-red-600 text-white py-4 px-10 rounded-full hover:bg-red-800 transition duration-300 text-center">
            Book Now
          </a>
        </Link>
      </section>

      {/* Query Form and Map */}
      <section className="flex flex-col md:flex-row justify-between items-center w-full px-0 bg-gray-100 py-8">
        <div className="w-full md:w-1/2 px-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Have any Queries? Reach out and get a call back from Showtime!
          </h2>
          <form
            className="bg-white shadow-md rounded-lg px-8 py-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);

              const name = formData.get("name") as string;
              const mobile = formData.get("mobile") as string;
              const query = formData.get("query") as string;

              if (!name || !mobile || !query) {
                alert("Please fill all the fields.");
                return;
              }

              try {
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

              form.reset();
            }}
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Your Name</label>
              <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-600" />
            </div>
            <div className="mb-4">
              <label htmlFor="mobile" className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
              <input type="tel" id="mobile" name="mobile" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-600" />
            </div>
            <div className="mb-4">
              <label htmlFor="query" className="block text-gray-700 text-sm font-bold mb-2">Your Query</label>
              <textarea id="query" name="query" rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-600"></textarea>
            </div>
            <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-800 transition duration-300">Submit</button>
          </form>
        </div>

        <div className="w-full md:w-1/2 px-6 mt-8 md:mt-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.2331728145536!2d77.3161935!3d28.5971406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ced61040f1983%3A0x16f8ea0e1f3e8c91!2sShowTime%20Cinema!5e0!3m2!1sen!2sin!4v1689582367082!5m2!1sen!2sin"
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
