"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const privacy = [
  {
    question: "Privacy Policy",
    answer: `
      <p><strong>Effective Date:</strong> April 26, 2025</p>
      <ol>
        <li><strong>Introduction:</strong> Welcome to Showtime Studio Co.! We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services or website.</li>
        <li><strong>Information We Collect:</strong>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, and payment details.</li>
            <li><strong>Usage Information:</strong> Data about how you interact with our website, such as IP address, browser type, and device information.</li>
            <li><strong>Booking Details:</strong> Information related to your event bookings, such as dates, room preferences, and additional services.</li>
          </ul>
        </li>
        <li><strong>How We Use Your Information:</strong>
          <ul>
            <li>Process bookings and payments.</li>
            <li>Send booking confirmations and updates.</li>
            <li>Improve our services and user experience.</li>
            <li>Respond to customer inquiries and provide support.</li>
          </ul>
        </li>
        <li><strong>Sharing Your Information:</strong> We do not sell or rent your personal information. However, we may share your data with trusted third-party service providers for:
          <ul>
            <li>Payment processing.</li>
            <li>Email communications and marketing.</li>
            <li>Compliance with legal obligations.</li>
          </ul>
        </li>
        <li><strong>Data Security:</strong> We implement appropriate technical and organizational measures to protect your data. However, no system is 100% secure, and we cannot guarantee the absolute security of your information.</li>
        <li><strong>Cookies:</strong> Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.</li>
        <li><strong>Your Rights:</strong> You have the right to:
          <ul>
            <li>Access and review your data.</li>
            <li>Request corrections to inaccurate data.</li>
            <li>Request deletion of your personal data.</li>
          </ul>
        </li>
        <li><strong>Changes to This Policy:</strong> We may update this Privacy Policy from time to time. The updated version will be posted on our website with the revised "Effective Date."</li>
        <li><strong>Contact Us:</strong> If you have any questions about this Privacy Policy, please contact us at:
          <ul>
            <li><strong>Email:</strong> theshowtimestudioco@gmail.com</li>
            <li><strong>Phone:</strong> +91 9811231212</li>
          </ul>
        </li>
      </ol>
    `,
  },
  {
    question: "Terms and Conditions",
    answer: `
      <p><strong>Effective Date:</strong> April 26, 2025</p>
      <ol>
        <li><strong>Introduction:</strong> These Terms and Conditions ("Terms") govern your use of Showtime Studio Co. services and website. By using our services, you agree to these Terms.</li>
        <li><strong>Booking and Payments:</strong>
          <ul>
            <li>All bookings must be confirmed with a valid payment method.</li>
            <li>A deposit may be required to secure your booking.</li>
            <li>Full payment must be made before the event.</li>
          </ul>
        </li>
        <li><strong>Customer Responsibilities:</strong>
          <ul>
            <li>Customers must comply with all rules and regulations of the venue.</li>
            <li>Illegal or prohibited content is strictly not allowed.</li>
            <li>Any damages caused to the property during the booking will be charged to the customer.</li>
          </ul>
        </li>
        <li><strong>Liability:</strong> Showtime Studio Co. is not responsible for any personal injuries, loss of belongings, or disruptions caused by technical issues or natural events. We reserve the right to cancel or modify bookings due to unforeseen circumstances.</li>
        <li><strong>Content Guidelines:</strong>
          <ul>
            <li>Customers are prohibited from playing illegal, prohibited, or copyrighted content without appropriate permissions.</li>
            <li>We reserve the right to stop any screening that violates these guidelines.</li>
          </ul>
        </li>
        <li><strong>Changes to Bookings:</strong> Changes must be requested at least 24 hours in advance and are subject to availability.</li>
        <li><strong>Termination:</strong> We reserve the right to terminate services if a customer violates these Terms.</li>
        <li><strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of India.</li>
        <li><strong>Contact Us:</strong>
          <ul>
            <li><strong>Email:</strong> theshowtimestudioco@gmail.com</li>
            <li><strong>Phone:</strong> +91 9811231212</li>
          </ul>
        </li>
      </ol>
    `,
  },
  {
    question: "Cancellation and Refund Policy",
    answer: `
      <p><strong>Effective Date:</strong> April 26, 2025</p>
      <ul class="list-disc list-inside space-y-2">
        <li>Cancellations made <strong>at least 24 hours</strong> prior to the event are eligible for a full refund.</li>
        <li>Cancellations made <strong>within 24 hours</strong> of the booking time are <strong>non-refundable</strong>.</li>
        <li>Refunds (if eligible) will be processed within <strong>7 business days</strong> to the original payment method.</li>
        <li>For payment or refund related issues, please contact us directly at <a href="mailto:theshowtimestudioco@gmail.com" class="text-blue-600 underline">theshowtimestudioco@gmail.com</a>.</li>
      </ul>
      <p class="mt-4 text-sm text-gray-500 italic">Payments powered by <a href="https://razorpay.com" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Razorpay</a>.</p>
    `,
  },
];

const PrivacyPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const togglePrivacy = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Privacy Policy, Terms & Refund</h1>
      <div className="w-full max-w-4xl">
        {privacy.map((faq, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
          >
            <button
              onClick={() => togglePrivacy(index)}
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
              <div
                className="px-6 py-4 text-gray-700 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPage;
