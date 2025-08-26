import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintester_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className="footer">
      {/* Logo Section */}
      <div className="footer-logo">
        <img src={footer_logo} alt="logo" />
        <p>SnapCart</p>
      </div>

      {/* Links Section */}
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      {/* Social Media Section */}
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <a 
            href="https://www.instagram.com/accounts/login/?hl=en" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={instagram_icon} alt="Instagram" />
          </a>
        </div>
        <div className="footer-icons-container">
          <a 
            href="https://www.pinterest.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={pintester_icon} alt="Pinterest" />
          </a>
        </div>
        <div className="footer-icons-container">
          <a 
            href="https://wa.me/919392589802" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={whatsapp_icon} alt="WhatsApp" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <hr />
        <p>Copyright © 2025 Shopper. All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
