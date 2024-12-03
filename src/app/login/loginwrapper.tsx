// src/login/LoginWrapper.tsx
"use client";

import React, { useEffect, useState } from "react";
import LoginDesktop from "./logindesktop";
import LoginMobile from "./loginmobile";

const LoginWrapper: React.FC = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1280); // Adjusted breakpoint to 1280px for tablet
    };

    handleResize(); // Initialize the state based on current window size
    window.addEventListener("resize", handleResize); // Add event listener for resize
    return () => window.removeEventListener("resize", handleResize); // Cleanup event listener on unmount
  }, []);

  return isMobileOrTablet ? <LoginMobile /> : <LoginDesktop />;
};

export default LoginWrapper;
