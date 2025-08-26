import React from 'react';
import './Offers.css';
import exclusive_image from '../Assets/exclusive_image.png';

const Offers = () => {
  return (
    <div className="offers">
      {/* Left Side */}
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button>Check Now</button>
      </div>

      {/* Right Side */}
      <div className="offers-right">
        <img src={exclusive_image} alt="Exclusive Offer" />
      </div>
    </div>
  );
};

export default Offers;
