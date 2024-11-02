import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full sm:w-1/4 mb-4">
            <h5 className="font-bold mb-2 mt-2">Company</h5>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Our Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">My Bookings</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Gallery</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blogs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
            </ul>
          </div>
          <div className="w-full sm:w-1/4 mb-6 mt-2">
            <h5 className="font-bold mb-2">Reach Us</h5>
            <p className="text-gray-400">
              Wazirpur Industrial Area<br/>
              +91 <br/>
              <a href="mailto:officeshowtime@gmail.com" className="text-gray-400 hover:text-white">officeshowtime@gmail.com</a>
            </p>
          </div>
          <div className="w-full sm:w-1/4 mb-6 mt-2">
            <h5 className="font-bold mb-2">Social Media</h5>
            
          </div>
          <div className="w-full sm:w-1/4 mb-6 mt-2">
            <h5 className="font-bold mb-2">Legal</h5>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white">Refund Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms and Conditions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          Copyright ©2024  Franchise LLP - Private Movie Theaters - All rights reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;