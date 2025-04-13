"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const faqs = [
    {
        question: "What is the Refund Policy?",
        answer:
          "Refunds are provided only if cancellations are made at least 24 hours prior to the booking time. Please contact us for more details",
      },
  {
    question: "Which movies or shows can we watch? Can we play our own videos?",
    answer:
      "You can watch any movie or show from our collection, or bring your own content to play in the theater.",
  },
  {
    question: "Illegal/Prohibited contents are not allowed. What are the guidelines?",
    answer:
      "Illegal or prohibited content is strictly not allowed. We do not take any liability for such cases.",
  },
  {
    question: "Am I responsible for my personal belongings?",
    answer:
      "Yes, customers are expected to take care of their own belongings. We are not liable for any personal item lost during your visit.",
  },
  {
    question: "Does the booking time include setup and wrap-up?",
    answer:
      "Absolutely. Your booking duration includes the time required for both setup and checkout. Plan your activities accordingly.",
  },
  {
    question: "Can we modify any technical setup inside the theater?",
    answer:
      "No, technical configurations such as projector, screen, or sound system must not be altered by customers. Our team will assist if any change is needed.",
  },
  {
    question: "Is there an age restriction for bookings?",
    answer:
      "Yes, couples under 18 years are not permitted to book the theater. Valid ID proof like Aadhaar or DL will be checked at the time of booking.",
  },
  {
    question: "What if we damage something inside the theater?",
    answer:
      "Customers will have to bear the cost of any damage to technical or non-technical items including walls, lights, or furniture.",
  },
  {
    question: "Is there any cleaning fee after the booking?",
    answer:
      "If significant cleaning is needed post your booking, a fee of up to ₹1000 may be charged to cover the cost of cleaning staff.",
  },
  {
    question: "What items are not allowed inside the theater?",
    answer:
      "Smoking, alcohol, or any illegal substance is strictly prohibited. We will take strict action if found violating this rule.",
  },
  {
    question: "Are pets allowed inside the venue?",
    answer:
      "No, pets are not permitted inside the theater premises under any circumstances.",
  },
  {
    question: "Can we bring our own food and drinks?",
    answer:
      "Yes, you can bring your own food or order online. We also have our in-house food menu. Cutlery is available at an extra cost.",
  },
  {
    question: "Do you have washroom facilities?",
    answer:
      "Yes, we have clean and well-maintained washrooms available at all our locations.",
  },
  {
    question: "Can we customize the decorations?",
    answer:
      "Decorations are generally as shown on the website. Personalization like neon signs or LED boards is available based on the selected package, but balloon color choices are fixed.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-6">FAQs</h1>
      <div className="w-full max-w-4xl">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-gray-900 focus:outline-none"
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUpIcon className="h-6 w-6 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 text-gray-700 bg-gray-50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
