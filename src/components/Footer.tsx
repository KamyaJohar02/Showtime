import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Company Section */}
          <div className="w-full sm:w-1/4 mb-6 mt-2">
            <h5 className="font-bold mb-4">Company</h5>
            <ul>
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white">Our Services</a></li>
              <li><a href="/rooms" className="text-gray-400 hover:text-white">Rooms</a></li>
              <li><a href="/gallery" className="text-gray-400 hover:text-white">Gallery</a></li>
              <li><a href="/blogs" className="text-gray-400 hover:text-white">Blogs</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white">FAQs</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="w-full sm:w-1/4 mb-6 mt-2">
            <h5 className="font-bold mb-4">Social Media</h5>
            <p className="text-gray-400 mb-2">Follow us on social media:</p>
            <a
              href="https://www.instagram.com/theshowtimestudio?igsh=eGh3N2tiZXNuYjNw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline"
            >
              Instagram
            </a>
          </div>

          {/* Legal Section */}
          <div className="w-full sm:w-1/4 mb-6 mt-2">
            <h5 className="font-bold mb-4">Legal</h5>
            <ul>
              <li>
                <a href="/privacy-policy" className="text-gray-400 hover:text-white">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-400 hover:text-white">
                  Terms and Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Reach Us Section */}
          <div className="w-full sm:w-1/4 mb-6 mt-2">
            <h5 className="font-bold mb-4">Reach Us</h5>
            <div className="text-gray-400">
              <address className="not-italic leading-relaxed">
                Business Name: MR B SERVICES<br />
                Billing Label: The Showtime Studio<br />
                Operational Address: 87/3 Block-A Wazirpur, Near by Shalimar Bagh Metro Station Gate 4&5 (Approx 500 mts),<br />
                New Delhi- 110052
              </address>
              <div className="mt-2">
                +91 9811231212<br />
                <a
                  href="mailto:theshowtimestudioco@gmail.com"
                  className="text-gray-400 hover:text-white"
                >
                  theshowtimestudioco@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 text-center text-gray-500">
          Copyright ©2024 Franchise LLP - Private Movie Theaters - All rights reserved
        </div>

        {/* Powered by Razorpay */}
        <div className="mt-2 text-center text-white font-semibold">
          ⚡ Powered by Razorpay
        </div>
      </div>
    </footer>
  );
};

export default Footer;
