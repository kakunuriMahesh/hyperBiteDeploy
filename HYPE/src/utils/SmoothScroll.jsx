// import { useEffect } from "react";
// import Lenis from "@studio-freight/lenis";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// let lenisInstance = null;

// export const SmoothScroll = () => {
//   useEffect(() => {
//     if (lenisInstance) return;

//     const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

//     lenisInstance = new Lenis({
//       smoothWheel: true,
//       smoothTouch: true,
//       lerp: 0.08,                 // controls inertia (lower = smoother)
//       duration: isTouch ? 0.8 : 1.2,
//       wheelMultiplier: 0.8,       // safe natural speed
//       touchMultiplier: 1,
//       normalizeWheel: true,
//       infinite: false,
//       easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
//     });

//     // Sync Lenis with ScrollTrigger
//     lenisInstance.on("scroll", ScrollTrigger.update);

//     // RAF loop
//     const raf = (time) => {
//       lenisInstance.raf(time);
//       requestAnimationFrame(raf);
//     };
//     requestAnimationFrame(raf);

//     // Refresh after mount
//     requestAnimationFrame(() => ScrollTrigger.refresh());

//     const handleResize = () => ScrollTrigger.refresh();
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       lenisInstance?.destroy();
//       lenisInstance = null;
//     };
//   }, []);

//   return null;
// };

// // Getter
// export const getLenis = () => lenisInstance;

// // Unified scrollTo
// export const scrollTo = (target, options = {}) => {
//   if (lenisInstance) {
//     lenisInstance.scrollTo(target, {
//       duration: 1.2,
//       easing: (t) => 1 - Math.pow(1 - t, 3),
//       ...options,
//     });
//   } else {
//     const top =
//       typeof target === "number"
//         ? target
//         : document.querySelector(target)?.offsetTop;

//     if (top !== undefined) {
//       window.scrollTo({ top, behavior: "smooth" });
//     }
//   }
// };


import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let rafId = null;

export const SmoothScroll = () => {
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // On touch devices, skip Lenis entirely — let native scrolling work
    if (isTouch) {
      // Ensure no scroll-blocking state from SSR or previous Lenis session
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      document.body.style.overflow = "";
      return;
    }

    if (lenisInstance) return;

    // Prevent browser scroll restoration from fighting Lenis
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }

    lenisInstance = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.08,
      duration: 1.2,
      wheelMultiplier: 0.8,
      normalizeWheel: true,
      infinite: false,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
    });

    lenisInstance.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      if (!lenisInstance) return;
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (rafId) cancelAnimationFrame(rafId);

      // Ensure scroll-blocking state is reset before destroying Lenis
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      document.body.style.overflow = "";

      lenisInstance?.destroy();
      lenisInstance = null;

      // Restore browser scroll restoration on cleanup
      if (history.scrollRestoration) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

  return null;
};

// Getter
export const getLenis = () => lenisInstance;

// Unified scrollTo
export const scrollTo = (target, options = {}) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      ...options,
    });
  } else {
    const top =
      typeof target === "number"
        ? target
        : document.querySelector(target)?.offsetTop;

    if (top !== undefined) {
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
};
