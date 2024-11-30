import "../Styles/Footer.css"
import { FaFacebook, FaInstagram, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a href="https://facebook.com/events/s/merweekend-2025/531073163082523/" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="social-icon" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="social-icon" />
        </a>
        <a href="https://koupaliste-uvaly0.webnode.cz/" target="_blank" rel="noopener noreferrer">
          <FaGlobe className="social-icon" />
        </a>
      </div>
      <div className="footer-text">
        © 2024 MerRodina by Chakitis
      </div>
    </footer>
  );
};

export default Footer;