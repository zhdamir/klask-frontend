import React from "react";
import '../styles/Footer.css'; // Import your footer styling if you have one

const Footer = () => {
  return (
    <footer className="footer">
     
        <div className="info">
          <p>Contact: zit@zit.de</p>
        </div>
        
        <div className="info">
          <p>Version 1.0.0</p>
        </div>
        <div className="info">
          <p>&copy; 2023 ZIT</p>
        </div>
      
    </footer>
  );
};

export default Footer;
