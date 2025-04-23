"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Trending from "@/components/trending";
import TopPage from "@/components/toppage";
import RoomCards from "@/components/rooms";
import Link from "next/link";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  return <ActualHome />;
}

function ActualHome() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const imagePaths = [5, 14, 3, 4, 13];
  const totalSlides = imagePaths.length;
  const textToDisplay = "What are you waiting for? Book now and indulge in the ultimate luxury experience, tailored just for you.";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

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

  useEffect(() => {
    const confirmed = localStorage.getItem("bookingConfirmed");
    const paymentId = localStorage.getItem("paymentId");
  
    if (confirmed === "true") {
      setShowConfirmation(true);
      setTimeout(() => {
        localStorage.removeItem("bookingConfirmed");
      }, 1000);
    }
  
    if (paymentId) {
      setPaymentId(paymentId);
      localStorage.removeItem("paymentId");
    }
  }, []);
  
  const [showConfirmation, setShowConfirmation] = useState(false);

  const services = [
    { title: 'Private Screening', image: '/Images/screening7.jpg' },
    { title: 'Snacks And Beverages', image: '/Images/snacks4.jpg' },
    { title: 'Bouquets', image: '/Images/Bouquet2.webp' },
    { title: 'Gifts', image: '/Images/gifts3.avif' },
    { title: 'Decorations', image: '/Images/decoration6.jpg' },
    { title: 'Cakes', image: '/Images/cakes5.webp' },
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
      {showConfirmation && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-fade-in">
      <Image
        src="/Images/tick.png"
        alt="Booking Confirmed"
        width={80}
        height={80}
        className="mx-auto mb-4"
      />
      <h2 className="text-xl font-semibold text-center mb-2">Booking Confirmed</h2>
      <p className="text-center text-sm text-gray-700 mb-2">
        Your booking has been successfully completed!
      </p>
      {paymentId && (
        <p className="text-center text-xs text-gray-500 mb-4">
          Payment ID: <strong>{paymentId}</strong>
        </p>
      )}
      <div className="flex justify-center gap-3">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-4 rounded"
          onClick={() => setShowConfirmation(false)}
        >
          Okay
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded"
          onClick={() => router.push("/myprofile")}
        >
          Go to My Bookings
        </button>
      </div>
    </div>
  </div>
)}

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

      <section className="w-full bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {services.map((service, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-44 sm:h-56 md:h-64"
                />
                <div className="text-center py-2 bg-gray-800 text-white font-semibold text-sm sm:text-base">
                  {service.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex justify-center mt-6 w-full">
        <Link
          href="/booking"
          className="bg-red-600 text-white py-3 px-8 rounded-full hover:bg-red-800 transition duration-300 text-center"
        >
          Book Now
        </Link>
      </section>

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
            src="https://www.google.com/maps/embed?..."
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
