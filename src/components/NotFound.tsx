import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>

      <div className="not-found-card">
        <h2>Oops! Page Not Found</h2>
        <p>The page you are looking for doesn’t exist or has been moved.</p>

        <div className="not-found-buttons">
          <Link to="/" className="home-button">
            Go Home
          </Link>
          <Link to="/contact" className="contact-button">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
