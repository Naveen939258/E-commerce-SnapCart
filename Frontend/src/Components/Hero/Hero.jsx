import React from 'react';
import './Hero.css';
import arrow_icon from '../Assets/arrow.png';
import hero_image from '../Assets/hero.png';

const Hero = () => {
  // Function to scroll safely
  const scrollToCollections = () => {
    const section = document.getElementById("new-collections");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("⚠️ Element with id 'new-collections' not found.");
    }
  };

  return (
    <div className="hero">
      {/* Left Section */}
      <div className="hero-left">
        <div>
          
          <p>Your Fashion, Your Family – All in One Place.</p>
        </div>

        {/* Scroll to NewCollections */}
        <div className="hero-latest-btn" onClick={scrollToCollections}>
          <div>Latest Collection</div>
          <img src={arrow_icon} alt="arrow" />
        </div>
      </div>

      {/* Right Section */}
      <div className="Hero-right">
        <img src={hero_image} alt="hero" />
      </div>
    </div>
  );
};

export default Hero;
