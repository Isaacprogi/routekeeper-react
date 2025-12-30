import React from "react";
// Import the styles as a module
import styles from "../styles/LoadingScreen.module.css";

export const LoadingScreen: React.FC = () => (
  <div className={styles["loading-screen"]}>
    {/* Dot notation works if there are no hyphens */}
    <div className={styles.spinner}></div>
    <p className={styles["loading-text"]}>Loading, please wait...</p>
  </div>
);