import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollTo } from "../utils/SmoothScroll";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll to top on every route change
    scrollTo(0, { duration: 0.6 });
  }, [pathname]);

  return null;
}
