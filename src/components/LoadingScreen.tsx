import React from "react";
import "../styles/LoadingScreen.css";

export const LoadingScreen: React.FC = () => (
  <div className="loading-screen">
    <div className="spinner"></div>
    <p className="loading-text">Loading, please wait...</p>
  </div>
);
