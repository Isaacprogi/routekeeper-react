import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingFallback.css";

export const LandingFallback: React.FC = () => {
  return (
    <div className="landing-fallback-container">
      <div className="max-w-2xl px-4">
       

        <h1 className="landing-fallback-title">Welcome to Route Keeper</h1>

        <p className="text-lg text-gray-700 mb-8">
          Next, provide your landing page or any custom component to the{" "}
          <code>privateFallback</code> prop to replace this default page.
        </p>
        <span style={{
          fontStyle:"italic",
          fontSize:"1rem"
        }}>
          Happy Routing 😊👌
        </span>
        <a
  href="https://isaacprogi.github.io/routekeeper-docs/docs"
  target="_blank"
  rel="noopener noreferrer"
  className="docs-link"
>
  Docs
</a>

      </div>
    </div>
  );
};
