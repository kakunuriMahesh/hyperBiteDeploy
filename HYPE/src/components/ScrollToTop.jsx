import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { scrollTo } from "../utils/SmoothScroll";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount to avoid fighting browser scroll restoration
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    scrollTo(0, { duration: 0.6 });
  }, [pathname]);

  return null;
}
