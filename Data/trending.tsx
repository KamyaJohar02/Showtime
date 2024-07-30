import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './trending.css'; // Ensure this path is correct

export const trending_data = [
  {
    id: 1,
    src: "/Images/1.webp",
    title: "Private Theatre",
    
    description: "Experience an exclusive cinematic journey with our Private Theatre. Whether it’s a special celebration or a cozy movie night, our theatre provides the perfect backdrop for unforgettable moments. Enjoy top-notch amenities and personalized service in a setting designed for comfort and privacy.",
  },
  {
    id: 2,
    src: "/Images/anniversaryshow.jpg",
    title: "Anniversaries",
    
    description: "Celebrate your love story in style with our Anniversary packages. Our Private Theatre offers a unique setting for marking milestones with intimate screenings and luxurious surroundings. Make your anniversary unforgettable with a personal touch and a memorable cinematic experience.",
  },
  {
    id: 3,
    src: "/Images/bdayshow.jpg",
    title: "Birthdays",
    
    description: "Transform your birthday into a blockbuster event with our Private Theatre. Host a private screening of your favorite films or a themed party for friends and family. Our theatre creates a festive atmosphere that ensures your special day is celebrated in a grand and unique way.",
  },
  {
    id: 4,
    src: "/Images/babyshower.jpg",
    title: "Surprises",
    
    description: "Plan the perfect surprise with our Private Theatre. From surprise parties to secret screenings, our venue is ideal for creating memorable moments that will leave your guests in awe. Make your next surprise event extraordinary with a personal touch and exclusive service.",
  },
  {
    id: 5,
    src: "/Images/kidscelebration.jpg",
    title: "Kids' Celebrations",
    
    description: "Bring magic to your child's special day with our Kids' Celebration packages. Our Private Theatre offers a fun-filled environment for birthday parties, movie marathons, and more. With kid-friendly amenities and a space designed for joy, it’s the perfect place to make their day unforgettable.",
  },
  {
    id: 6,
    src: "/Images/magician.jpg",
    title: "Magicians",
    
    description: "Enchant your guests with our Magician events in the Private Theatre. Whether it’s a magic show or interactive entertainment, our theatre provides a captivating setting for spellbinding performances. Create a magical experience with professional entertainment in a unique venue.",
  },
  {
    id: 7,
    src: "/Images/tattoartist.jpg",
    title: "Tattoo Artists",
    
    description: "Host a tattoo-themed event at our Private Theatre. Ideal for tattoo conventions, exhibitions, or special presentations, our theatre offers a unique space for creativity and artistry. Elevate your event with a distinctive venue and exclusive amenities. Make your event unforgettable with us.",
  },
];

const Trending: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true, // Enable default arrows
    centerMode: false, // Disable center mode
    centerPadding: '0px', // Ensure padding is set correctly
  };

  return (
    <div className="trending-carousel-container">
      <Slider {...settings}>
        {trending_data.map((item) => (
          <div key={item.id} className="trending-item">
            <div className="trending-image-container">
              <img src={item.src} alt={item.title} className="trending-image" />
            </div>
            <div className="trending-info">
              <h3>{item.title}</h3>
              <p>{item.location}</p>
              <span>{item.description}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Trending;