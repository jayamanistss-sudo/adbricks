import { useState, useEffect } from "react";

export const useResponsive = () => {
  const getBreakpoint = (width) => {
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    if (width < 1246) return "smallLaptop";
    return "desktop";
  };

  const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};
