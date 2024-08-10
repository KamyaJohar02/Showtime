// src/components/TopPage.tsx

import React from 'react';
import Image from 'next/image';
import './toppage.css';

const backgroundImage = '/Images/c1.jpg'; // Ensure this path is correct
const textToDisplay = 'Book for your special occasion with us'; // Static text

const TopPage: React.FC = () => {
  return (
    <div className="top-page-container">
      <div className="image-background">
        <Image
          src={backgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="text-overlay">
        <h2>{textToDisplay}</h2>
      </div>
    </div>
  );
};

export default TopPage;