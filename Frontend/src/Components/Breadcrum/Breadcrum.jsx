import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";

const Breadcrum = (props) => {
  const { product } = props;

  // If product is undefined, return null or a placeholder
  if (!product) return null;

  return (
    <div className="breadcrum">
      HOME <img src={arrow_icon} alt="arrow" />
      SHOP <img src={arrow_icon} alt="arrow" />
      {product.category || "Category"} <img src={arrow_icon} alt="arrow" />
      <span className="breadcrum-title">{product.name || "Product Name"}</span>
    </div>
  );
};

export default Breadcrum;
