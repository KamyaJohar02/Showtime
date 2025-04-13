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
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-white">
                  Our Services
                </a>
              </li>
              <li>
                <a href="/rooms" className="text-gray-400 hover:text-white">
                  Rooms
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-400 hover:text-white">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/blogs" className="text-gray-400 hover:text-white">
                  Blogs
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white">
                  FAQs
                </a>
              </li>
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
                <a href="/faq" className="text-gray-400 hover:text-white">
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Terms and Conditions
                </a>
              </li>
              {/* <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </a>
              </li> */}
            </ul>
          </div>

          {/* Reach Us Section */}
          <div className="w-full sm:w-1/4 mb-6 mt-2">
            <h5 className="font-bold mb-4">Reach Us</h5>
            <p className="text-gray-400">
              Wazirpur Industrial Area
              <br />
              +91
              <br />
              <a
                href="mailto:officeshowtime@gmail.com"
                className="text-gray-400 hover:text-white"
              >
                officeshowtime@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 text-center text-gray-500">
          Copyright ©2024 Franchise LLP - Private Movie Theaters - All rights
          reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
