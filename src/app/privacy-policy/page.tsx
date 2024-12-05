"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const privacy = [
  {
    question: "Privacy Policy",
    answer: `
      <p><strong>Effective Date:</strong> [Insert Date]</p>
      <ol>
        <li><strong>Introduction:</strong> Welcome to [Your Business Name]! We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services or website.</li>
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
            <li><strong>Email:</strong> officeshowtime@gmail.com</li>
            <li><strong>Phone:</strong> +91 [Insert Phone Number]</li>
          </ul>
        </li>
      </ol>
    `,
  },
  {
    question: "Terms and Conditions",
    answer: `
      <p><strong>Effective Date:</strong> [Insert Date]</p>
      <ol>
        <li><strong>Introduction:</strong> These Terms and Conditions ("Terms") govern your use of [Your Business Name] services and website. By using our services, you agree to these Terms.</li>
        <li><strong>Booking and Payments:</strong>
          <ul>
            <li>All bookings must be confirmed with a valid payment method.</li>
            <li>A deposit may be required to secure your booking.</li>
            <li>Full payment must be made before the event.</li>
          </ul>
        </li>
        <li><strong>Cancellation and Refund Policy:</strong>
          <ul>
            <li>Cancellations made at least 48 hours prior to the event are eligible for a refund.</li>
            <li>No refunds will be issued for cancellations made within 48 hours of the event.</li>
            <li>Refunds will be processed within 7 business days.</li>
          </ul>
        </li>
        <li><strong>Customer Responsibilities:</strong>
          <ul>
            <li>Customers must comply with all rules and regulations of the venue.</li>
            <li>Illegal or prohibited content is strictly not allowed.</li>
            <li>Any damages caused to the property during the booking will be charged to the customer.</li>
          </ul>
        </li>
        <li><strong>Liability:</strong> [Your Business Name] is not responsible for any personal injuries, loss of belongings, or disruptions caused by technical issues or natural events. We reserve the right to cancel or modify bookings due to unforeseen circumstances.</li>
        <li><strong>Content Guidelines:</strong>
          <ul>
            <li>Customers are prohibited from playing illegal, prohibited, or copyrighted content without appropriate permissions.</li>
            <li>We reserve the right to stop any screening that violates these guidelines.</li>
          </ul>
        </li>
        <li><strong>Changes to Bookings:</strong> Changes to bookings must be requested at least 24 hours in advance and are subject to availability.</li>
        <li><strong>Termination:</strong> We reserve the right to terminate services if a customer violates these Terms.</li>
        <li><strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].</li>
        <li><strong>Contact Us:</strong> If you have any questions about these Terms, please contact us at:
          <ul>
            <li><strong>Email:</strong> officeshowtime@gmail.com</li>
            <li><strong>Phone:</strong> +91 [Insert Phone Number]</li>
          </ul>
        </li>
      </ol>
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
      <h1 className="text-3xl font-bold text-red-600 mb-6">Privacy Policy and TNCs</h1>
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
