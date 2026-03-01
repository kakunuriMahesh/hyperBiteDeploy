import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productConfigs, getAnimationPositions } from "../config/productConfig";
import { useGSAPContext } from "../hooks/useGSAPContext";

gsap.registerPlugin(ScrollTrigger);

const NutsLayout = ({ productConfig, breakpoint: propBreakpoint, onOpenDetails }) => {
  const [scale, setScale] = useState(1);
  const [breakpoint, setBreakpoint] = useState(propBreakpoint || "desktop");
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Refs for all elements (nuts + vector)
  const elementRefs = {
    pumpkinseed1: useRef(null),
    wallnut1: useRef(null),
    sunflowerseed1: useRef(null),
    dateorange1: useRef(null),
    dateorange2: useRef(null),
    sunflowershell: useRef(null),
    sunflowerseed2: useRef(null),
    pumpkinseed2: useRef(null),
    date: useRef(null),
    wallnutCenter: useRef(null),
    openCover: useRef(null),
    closeCover: useRef(null),
    vector: useRef(null),
  };

  // Update breakpoint and scale
  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      let newBreakpoint = "desktop";
      let baseWidth = 1698;

      if (viewportWidth < 768) {
        newBreakpoint = "mobile";
        baseWidth = 375;
      } else if (viewportWidth < 1024) {
        newBreakpoint = "tablet";
        baseWidth = 768;
      } else {
        newBreakpoint = "desktop";
        baseWidth = 1698;
      }

      setBreakpoint(newBreakpoint);

      if (newBreakpoint === "desktop") {
        const newScale = Math.min((viewportWidth * 0.96) / 1698, 1);
        setScale(newScale);
      } else {
        setScale(1);
      }
    };

    updateScale();
    const resizeHandler = () => {
      updateScale();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // GSAP Animations
  useGSAPContext(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const viewportWidth = window.innerWidth;
    const currentViewportHeight = window.innerHeight;

    // Get product-specific animation positions based on current breakpoint
    const animationData = getAnimationPositions(
      "nuts",
      breakpoint,
      currentViewportHeight
    );
    const initialPositions = animationData.initial;
    const finalPositions = animationData.final;

    // Get product-specific rotation speeds and animation settings
    const rotationSpeeds = productConfig.animations.rotationSpeeds;

    // All breakpoints use viewport-based calculations (3 sections of 100vh each)
    const animationEndPoint = currentViewportHeight * 2; // 200vh

    // Prepare all elements (nuts + vector) with GPU acceleration and initial positions
    const elements = [];
    Object.keys(elementRefs).forEach((key) => {
      const ref = elementRefs[key].current;
      if (!ref) return;

      const initial = initialPositions[key];
      const final = finalPositions[key];
      if (!initial || !final) return;

      gsap.set(ref, {
        force3D: true,
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
      });

      const initialScale = 1;
      const finalScale = final.width / initial.width;

      gsap.set(ref, {
        x: initial.x,
        y: initial.y,
        rotation: initial.rotation || 0,
        width: initial.width,
        height: initial.height,
        scale: initialScale,
        left: "auto",
        top: "auto",
      });

      elements.push({
        element: ref,
        initial: { ...initial, scale: initialScale },
        final: {
          ...final,
          scale: finalScale,
          rotation: (final.rotation || 0) + (rotationSpeeds[key] || 0),
        },
      });
    });

    // Ensure we have elements before creating ScrollTrigger
    if (elements.length === 0) {
      console.warn("No elements found for animation");
      return;
    }

    // Create GSAP timeline with ScrollTrigger scrub
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${Math.round(animationEndPoint)}`,
        scrub: 1.2,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (elementRefs.vector.current) {
            elementRefs.vector.current.style.zIndex = self.progress > 0.3 ? "6" : "1";
          }
        },
      },
    });

    // Add all element animations to timeline
    elements.forEach(({ element, initial, final }) => {
      tl.fromTo(
        element,
        {
          x: initial.x,
          y: initial.y,
          rotation: initial.rotation,
          scale: initial.scale,
        },
        {
          x: final.x,
          y: final.y,
          rotation: final.rotation,
          scale: final.scale,
          ease: "none",
        },
        0
      );
    });

    // Refresh ScrollTrigger after setup
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [scale, breakpoint, containerRef, elementRefs, productConfig]);

  // Calculate container dimensions based on breakpoint
  const getContainerDimensions = () => {
    const viewportHeight =
      typeof window !== "undefined"
        ? window.innerHeight
        : breakpoint === "mobile"
        ? 750
        : breakpoint === "tablet"
        ? 1024
        : 1080;

    if (breakpoint === "mobile") {
      return {
        width: "100%",
        height: "auto",
        minHeight: `${viewportHeight * 3}px`,
        baseWidth: 375,
        baseHeight: viewportHeight * 3,
      };
    } else if (breakpoint === "tablet") {
      return {
        width: "100%",
        height: "auto",
        minHeight: `${viewportHeight * 3}px`,
        baseWidth: 768,
        baseHeight: viewportHeight * 3,
      };
    } else {
      return {
        width: `${1698 * scale}px`,
        height: "auto",
        minHeight: `${viewportHeight * 3}px`,
        baseWidth: 1698,
        baseHeight: viewportHeight * 3,
      };
    }
  };

  const containerDims = getContainerDimensions();

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{
        overflow: "hidden",
        width: containerDims.width,
        // minHeight: containerDims.minHeight,
        // height: containerDims.height,
        margin: "0 auto",
        maxWidth: breakpoint === "desktop" ? "none" : "100%",
        paddingBottom:
          breakpoint === "mobile"
            ? "120px"
            : breakpoint === "tablet"
            ? "150px"
            : `${150 * scale}px`,
      }}
    >
      <div
        ref={containerRef}
        className="relative bg-white"
        style={{
          width: breakpoint === "desktop" ? "1698px" : "100%",
          // minHeight: containerDims.minHeight,
          height: containerDims.minHeight,
          transform: breakpoint === "desktop" ? `scale(${scale})` : "none",
          transformOrigin: "top left",
        }}
      >
        {/* First Section Heading */}
        <div
          className="absolute [font-family:'Permanent_Marker-Regular',Helvetica] font-normal text-black tracking-[0] leading-[normal]"
          style={{
            zIndex: 10,
            top: breakpoint === "mobile" ? "17.5%" : breakpoint === "tablet" ? "16%" : "12%",
            left: breakpoint === "mobile" ? "25px" : breakpoint === "tablet" ? "50px" : "5%",
            width:
              breakpoint === "mobile"
                ? "312px"
                : breakpoint === "tablet"
                ? "calc(100% - 100px)"
                : "649px",
            fontSize: breakpoint === "mobile" ? "24px" : breakpoint === "tablet" ? "36px" : "74px",
            fontFamily: "'Montserrat', 'Oswald', 'Permanent Marker', Arial, sans-serif",
            lineHeight: "1.05",
          }}
        >
          {productConfig.heading1}
        </div>

        {/* First Section Paragraph */}
        <p
          className="absolute [font-family:'Just_Me_Again_Down_Here-Regular',Helvetica] font-normal text-black tracking-[0] leading-[normal]"
          style={{
            zIndex: 10,
            top:
              breakpoint === "mobile"
                ? "calc(16% + 80px)"
                : breakpoint === "tablet"
                ? "calc(16% + 80px)"
                : "calc(18% + 180px)",
            left: breakpoint === "mobile" ? "25px" : breakpoint === "tablet" ? "50px" : "5%",
            width:
              breakpoint === "mobile"
                ? "312px"
                : breakpoint === "tablet"
                ? "calc(100% - 100px)"
                : "80%",
            fontSize: breakpoint === "mobile" ? "14px" : breakpoint === "tablet" ? "18px" : "24px",
            lineHeight: "1.1",
            marginTop: "12px",
          }}
        >
          {productConfig.paragraph1}
        </p>

        {/* Quote between first and second section */}
        <div
          className="absolute text-black text-center"
          style={{
            zIndex: 10,
            top: breakpoint === "mobile" ? "50%" : breakpoint === "tablet" ? "50%" : "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width:
              breakpoint === "mobile"
                ? "calc(100% - 40px)"
                : breakpoint === "tablet"
                ? "calc(100% - 100px)"
                : "600px",
            fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
            fontSize: breakpoint === "mobile" ? "18px" : breakpoint === "tablet" ? "22px" : "28px",
            lineHeight: "1.3",
            fontStyle: "italic",
            padding:
              breakpoint === "mobile" ? "40px 20px" : breakpoint === "tablet" ? "50px 20px" : "150px 20px",
          }}
        >
          "{productConfig.quote || "Crunchy, nutritious, and full of natural goodness"}"
        </div>

        {/* Product Images - Positions set by GSAP based on breakpoint */}
        <img
          ref={elementRefs.pumpkinseed1}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.pumpkinseed1}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />
        <img
          ref={elementRefs.wallnut1}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.wallnut1}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />
        <img
          ref={elementRefs.sunflowerseed1}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.sunflowerseed1}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />
        <img
          ref={elementRefs.dateorange1}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.dateorange1}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />
        <img
          ref={elementRefs.dateorange2}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.dateorange2}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />
        <img
          ref={elementRefs.sunflowershell}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.sunflowershell}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />
        <img
          ref={elementRefs.sunflowerseed2}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.sunflowerseed2}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />
        <img
          ref={elementRefs.pumpkinseed2}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.pumpkinseed2}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />

        {/* openCover - aligned to first (top/left) section */}
        <img
          ref={elementRefs.openCover}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Open Cover"
          src={productConfig.images.openCover}
          loading="eager"
          decoding="async"
          style={{
            transformOrigin: "center",
            zIndex: 4,
            backfaceVisibility: "hidden",
            ...(breakpoint === "mobile" || breakpoint === "tablet"
              ? {
                  left: "5%",
                  top: "5%",
                  transform: "translateX(-50%) rotate(40deg)",
                  width: "80%",
                  maxWidth: "200px",
                }
              : {
                  right: "8%",
                  top: "5%",
                  width: "40%",
                  maxWidth: "400px",
                  transform: "rotate(-45deg)",
                }),
          }}
        />

        {/* closeCover - aligned to second (bottom/right) section */}
        <img
          ref={elementRefs.closeCover}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Closed Cover"
          src={productConfig.images.closeCover}
          loading="eager"
          decoding="async"
          style={{
            transformOrigin: "center",
            zIndex: 4,
            backfaceVisibility: "hidden",
            ...(breakpoint === "mobile" || breakpoint === "tablet"
              ? {
                  left: "50%",
                  bottom:
                    breakpoint === "mobile"
                      ? "calc(6%)"
                      : breakpoint === "tablet"
                      ? "calc(6% + 100px)"
                      : "calc(6% - 600px)",
                  transform: "translateX(-50%)",
                  width: "80%",
                  maxWidth: "200px",
                }
              : {
                  left: "8%",
                  bottom:
                    breakpoint === "mobile"
                      ? "calc(6% - 180px)"
                      : breakpoint === "tablet"
                      ? "calc(6% - 180px)"
                      : "calc(6% - 600px)",
                  width: "40%",
                  maxWidth: "400px",
                }),
          }}
        />

        {/* Second Section Heading */}
        <div
          className="absolute [font-family:'Permanent_Marker-Regular',Helvetica] font-normal text-black tracking-[0] leading-[normal]"
          style={{
            zIndex: 10,
            bottom: breakpoint === "mobile" ? "6%" : breakpoint === "tablet" ? "6%" : "-5%",
            right: breakpoint === "mobile" ? "25px" : breakpoint === "tablet" ? "50px" : "12%",
            width:
              breakpoint === "mobile"
                ? "312px"
                : breakpoint === "tablet"
                ? "calc(100% - 100px)"
                : "520px",
            fontSize: breakpoint === "mobile" ? "24px" : breakpoint === "tablet" ? "36px" : "74px",
            fontFamily: "'Montserrat', 'Oswald', 'Permanent Marker', Arial, sans-serif",
            lineHeight: "1.05",
            textAlign: breakpoint === "mobile" || breakpoint === "tablet" ? "left" : "left",
          }}
        >
          {productConfig.heading2}
        </div>

        {/* Second Section Paragraph */}
        <p
          className="absolute [font-family:'Just_Me_Again_Down_Here-Regular',Helvetica] font-normal text-black tracking-[0] leading-[normal]"
          style={{
            zIndex: 10,
            bottom:
              breakpoint === "mobile"
                ? "calc(6% - 100px)"
                : breakpoint === "tablet"
                ? "calc(6% - 100px)"
                : "calc(6% - 500px)",
            right: breakpoint === "mobile" ? "25px" : breakpoint === "tablet" ? "50px" : "12%",
            width:
              breakpoint === "mobile"
                ? "312px"
                : breakpoint === "tablet"
                ? "calc(100% - 100px)"
                : "520px",
            fontSize: breakpoint === "mobile" ? "14px" : breakpoint === "tablet" ? "18px" : "24px",
            lineHeight: "1.1",
            marginTop: "12px",
            textAlign: breakpoint === "mobile" || breakpoint === "tablet" ? "left" : "left",
          }}
        >
          {productConfig.paragraph2}
        </p>

        {/* Check Details Button */}
        {onOpenDetails && (
          <button
            onClick={onOpenDetails}
            style={{
              position: "absolute",
              zIndex: 10,
              bottom:
                breakpoint === "mobile"
                  ? "calc(6% - 180px)"
                  : breakpoint === "tablet"
                  ? "calc(6% - 180px)"
                  : "calc(6% - 600px)",
              right: breakpoint === "mobile" ? "16px" : breakpoint === "tablet" ? "50px" : "12%",
              padding:
                breakpoint === "mobile" ? "10px 20px" : breakpoint === "tablet" ? "12px 24px" : "14px 28px",
              fontFamily: "'Permanent_Marker-Regular', Helvetica",
              fontSize: breakpoint === "mobile" ? "18px" : breakpoint === "tablet" ? "20px" : "22px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#333";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#000";
              e.target.style.transform = "scale(1)";
            }}
          >
            Check Details
          </button>
        )}

        {/* Date Image */}
        <img
          ref={elementRefs.date}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.date}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />

        {/* Vector Background */}
        <img
          ref={elementRefs.vector}
          className="absolute scroll-animated"
          alt="Vector"
          src={productConfig.vector}
          loading="eager"
          decoding="async"
          style={{
            backfaceVisibility: "hidden",
            // objectFit: "cover",
            zIndex: 1,
          }}
        />

        {/* Wallnut Center */}
        <img
          ref={elementRefs.wallnutCenter}
          className="absolute aspect-[0.67] object-cover scroll-animated"
          alt="Product"
          src={productConfig.images.wallnutCenter}
          loading="eager"
          decoding="async"
          style={{ transformOrigin: "center", zIndex: 5, backfaceVisibility: "hidden" }}
        />
      </div>
    </section>
  );
};

export default NutsLayout;




