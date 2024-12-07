"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import LoginDesktop from "./logindesktop";
import LoginMobile from "./loginmobile";

const LoginWrapper: React.FC = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1280); // Adjusted breakpoint to 1280px for tablet
    };

    const debouncedResize = debounce(handleResize, 200); // Debounce to prevent rapid triggering
    debouncedResize(); // Initialize the state based on current window size
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  function debounce(fn: Function, delay: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  return isMobileOrTablet ? <LoginMobile /> : <LoginDesktop />;
};

export default LoginWrapper;
