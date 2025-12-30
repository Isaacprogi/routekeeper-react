import React from "react";
import { Link } from "react-router-dom";
import "../styles/UnAuthorized.css";

export const Unauthorized: React.FC = () => {
  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">401</h1>

      <div className="unauthorized-card">
        <h2>Unauthorized Access</h2>
        <div className="unauthorized-buttons">
          <Link to="/">Go Home</Link>
        </div>
      </div>
    </div>
  );
};

