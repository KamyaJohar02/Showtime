"use client";

import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const blogs = [
  {
    title: "5 Tips to Make Your Event Memorable 🎉",
    content: `
      <p>Hosting a successful event doesn't have to be stressful. Here are 5 quick tips:</p>
      <ul>
        <li>✅ Plan in advance</li>
        <li>✅ Choose the right venue</li>
        <li>✅ Personalize the experience</li>
        <li>✅ Ensure tech readiness</li>
        <li>✅ Follow up after the event</li>
      </ul>
      <p>Want to know more? Stay tuned for our detailed event planning guide next week!</p>
    `,
  },
  {
    title: "Behind the Scenes: How Showtime Makes It All Happen 🎬",
    content: `
      <p>Ever wondered what goes on behind your booking experience?</p>
      <p>From seamless tech integrations to a customer support team that cares — we make it happen so your events go smoothly.</p>
      <p>Thanks for trusting us with your celebrations!</p>
    `,
  },
];

const BlogPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleBlog = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Showtime Blog</h1>
      <div className="w-full max-w-4xl">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
          >
            <button
              onClick={() => toggleBlog(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-gray-900 focus:outline-none"
            >
              {blog.title}
              {openIndex === index ? (
                <ChevronUpIcon className="h-6 w-6 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div
                className="px-6 py-4 text-gray-700 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
