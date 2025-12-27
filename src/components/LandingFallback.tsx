import React from "react";
import "../styles/LandingFallback.css";

export const LandingFallback: React.FC = () => {
  return (
    <div className="landing-fallback-container">
      <h1 className="landing-fallback-title">
        Welcome to Your App
      </h1>
      <p className="landing-fallback-subtitle">
        This page will appear while we get things ready for you.
      </p>
      <div className="landing-fallback-emoji">🚀</div>
    </div>
  );
};
