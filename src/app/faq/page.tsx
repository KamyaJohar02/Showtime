"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const faqs = [
    {
        question: "What is the Refund Policy?",
        answer:
          "Refunds are provided only if cancellations are made at least 48 hours prior to the booking time. Please read our refund policy for more details.",
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
    question: "Random Q",
    answer:
      "Answer.",
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
