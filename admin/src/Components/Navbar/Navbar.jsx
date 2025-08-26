import React from "react";
import "./Navbar.css";
import navLogo from "../../assets/logo_big.png";
import navProfile from "../../assets/hero.jpg";

const Navbar = () => {
  return (
    <div className="navbar">
      {/* Logo */}
      <img src={navLogo} alt="Logo" className="nav-logo" />
      <h3>SnapCart</h3>

      {/* Profile */}
      <img src={navProfile} alt="Profile" className="nav-profile" />
    </div>
  );
};

export default Navbar;
