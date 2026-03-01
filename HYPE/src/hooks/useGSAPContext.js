import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook to manage GSAP context for animations
 * Automatically cleans up all animations on unmount
 */
export const useGSAPContext = (fn, deps = []) => {
  const ctxRef = useRef(null);

  useEffect(() => {
    // Create GSAP context
    ctxRef.current = gsap.context(() => {
      fn();
    });

    return () => {
      // Cleanup: kill all animations and ScrollTriggers in this context
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, deps);

  return ctxRef;
};

