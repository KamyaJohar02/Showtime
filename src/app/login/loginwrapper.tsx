// src/login/LoginWrapper.tsx
"use client";

import React, { useEffect, useState } from "react";
import LoginDesktop from "./logindesktop";
import LoginMobile from "./loginmobile";

const LoginWrapper: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <LoginMobile /> : <LoginDesktop />;
};

export default LoginWrapper;
