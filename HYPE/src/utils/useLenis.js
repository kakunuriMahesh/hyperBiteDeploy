// This hook is deprecated - use SmoothScroll component instead
// Keeping for backward compatibility
import { useEffect } from "react";

export const useLenis = () => {
  // No-op - SmoothScroll component handles everything
  useEffect(() => {
    // SmoothScroll component in App.jsx handles Lenis initialization
  }, []);
};

