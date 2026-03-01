import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAPContext } from "../hooks/useGSAPContext";
gsap.registerPlugin(ScrollTrigger);

const DOT_SIZE_DESKTOP = 36;
const DOT_SIZE_MOBILE = 24;

const TIMELINE_STEPS = [
  {
    progress: 0.28,
    label: "Made with premium, handpicked dates that are naturally soft and sweet.",
    imageKey: "date1",
    color: "#000",
  },
  {
    progress: 0.46,
    label: "Filled with creamy pista paste and finely shredded coconut for a rich, nutty flavor.",
    imageKey: "date2",
    color: "#FFD93D",
  },
  {
    progress: 0.84,
    label: "A wholesome, energy-boosting treat with no refined sugar or artificial additives.",
    imageKey: "date3",
    color: "#6BCB77",
  },
  // {
  //   progress: 0.98,
  //   label: "Final",
  //   imageKey: "date4",
  //   color: "#4D96FF",
  //   final: true,
  // },
];

const DatesTimeline = ({
  productConfig,
  onOpenDetails,
  breakpoint: propBreakpoint,
}) => {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const canvasRef = useRef(null);
  const itemRefs = useRef([]);
  const activeStepRef = useRef(-1);
  const dotStateRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    prevX: 0,
    prevY: 0,
    color: TIMELINE_STEPS[0]?.color || "#000",
  });
  const animationFrameRef = useRef(null);
  const [breakpoint, setBreakpoint] = useState(propBreakpoint || "desktop");
  const [dotSize, setDotSize] = useState(DOT_SIZE_DESKTOP);

  useEffect(() => {
    if (propBreakpoint) {
      setBreakpoint(propBreakpoint);
    }
  }, [propBreakpoint]);

  useEffect(() => {
    const updateBreakpoint = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 768) {
        setBreakpoint("mobile");
        setDotSize(DOT_SIZE_MOBILE);
      } else if (viewportWidth < 1024) {
        setBreakpoint("tablet");
        setDotSize(DOT_SIZE_MOBILE);
      } else {
        setBreakpoint("desktop");
        setDotSize(DOT_SIZE_DESKTOP);
      }
    };
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, [propBreakpoint]);

  // Properly calculate SVG height from aspect ratio + make wrapper tall enough
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const svg = svgRef.current;
    if (!svg || !wrapper) return;

    const updateDimensions = () => {
      const aspectRatio = breakpoint === "mobile" ? 4971 / 1202 : 3930 / 990; // Updated for new viewBox
      const svgWidth = svg.clientWidth;
      const calculatedSvgHeight = svgWidth * aspectRatio;

      svg.style.height = `${calculatedSvgHeight}px`;

      const extraScroll = window.innerHeight * 1;
      wrapper.style.height = `${calculatedSvgHeight + extraScroll}px`;
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [breakpoint]);

  // Drop animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size (use device pixel ratio for crisp rendering)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dotSize * dpr;
    canvas.height = dotSize * dpr;
    canvas.style.width = `${dotSize}px`;
    canvas.style.height = `${dotSize}px`;
    
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    
    const state = dotStateRef.current;
    const baseRadius = dotSize / 2;

    const drawDrop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, dotSize, dotSize);
      
      // Smooth position follow
      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;
      state.currentX += dx * 0.2;
      state.currentY += dy * 0.2;
      
      // Calculate velocity (speed and direction)
      const velX = state.currentX - state.prevX;
      const velY = state.currentY - state.prevY;
      const velocity = Math.sqrt(velX * velX + velY * velY);
      
      // Store previous position
      state.prevX = state.currentX;
      state.prevY = state.currentY;
      
      // Initialize previous position if not set
      if (state.prevX === 0 && state.prevY === 0 && state.currentX !== 0 && state.currentY !== 0) {
        state.prevX = state.currentX;
        state.prevY = state.currentY;
      }

      // Calculate stretch based on velocity (faster = more stretched)
      // Max stretch is 2x the radius when moving very fast
      const maxStretch = baseRadius * 1.5;
      const stretchAmount = Math.min(velocity * 0.5, maxStretch);
      
      // Calculate angle of movement
      const angle = Math.atan2(velY, velX);
      
      const centerX = dotSize / 2;
      const centerY = dotSize / 2;

      ctx.save();
      // ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      // ctx.shadowBlur = 8;
      // ctx.shadowOffsetX = 0;
      // ctx.shadowOffsetY = 4;
      
      ctx.fillStyle = state.color;
      ctx.beginPath();

      if (velocity < 0.5) {
        // Draw circle when moving slowly or at rest
        ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      } else {
        // Draw stretched ellipse (drop shape) when moving fast
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        // Stretch horizontally (in direction of movement), compress slightly vertically
        const radiusX = baseRadius + stretchAmount;
        const radiusY = baseRadius * Math.max(0.7, 1 - stretchAmount * 0.2);
        
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
      }

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      drawDrop();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dotSize]);

  useGSAPContext(() => {
    const wrapper = wrapperRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !svg || !path || !canvas) return;

    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // 🎯 Jelly/Fluid effect: use scrub with lag (0.5 seconds) for smooth, wobbly follow
    ScrollTrigger.create({
      trigger: wrapper,
      start: "top 60%",
      end: "bottom bottom+=50%",
      scrub: 0.5, // ← Key for jelly-like lag (instead of 1)
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Path reveal (smooth with scrub lag)
        gsap.set(path, {
          strokeDashoffset: pathLength * (1 - p),
        });

        // Dot position calculation
        const pt = path.getPointAtLength(p * pathLength);
        const sp = svg.createSVGPoint();
        sp.x = pt.x;
        sp.y = pt.y;
        const screenPt = sp.matrixTransform(svg.getScreenCTM());

        const wrapperRect = wrapper.getBoundingClientRect();
        const targetX = screenPt.x - wrapperRect.left;
        const targetY = screenPt.y - wrapperRect.top;

        // Update dot target position
        const state = dotStateRef.current;
        state.targetX = targetX;
        state.targetY = targetY;

        // Update canvas position
        gsap.set(canvas, {
          left: targetX - dotSize / 2,
          top: targetY - dotSize / 2,
        });

        // Color change
        TIMELINE_STEPS.forEach((step, i) => {
          if (p >= step.progress && activeStepRef.current !== i) {
            activeStepRef.current = i;
            state.color = step.color;
          }
        });

        // Timeline items (text + images)
        TIMELINE_STEPS.forEach((step, i) => {
          const el = itemRefs.current[i];
          if (!el) return;

          const active = p >= step.progress;

          const mp = path.getPointAtLength(step.progress * pathLength);
          const sp2 = svg.createSVGPoint();
          sp2.x = mp.x;
          sp2.y = mp.y;
          const screen2 = sp2.matrixTransform(svg.getScreenCTM());

          const isLeft = i % 2 === 1;
          const isSmall = breakpoint !== "desktop";
          
          // 📍 HORIZONTAL OFFSET: Adjust these values to move items left/right
          // Negative = left side, Positive = right side
          const offsetX = isLeft 
            ? (isSmall ? -120 : -180)  // 🔧 Left side offset (mobile: -120, desktop: -180)
            : (isSmall ? 20 : -100);      // 🔧 Right side offset (mobile: 20, desktop: 60)
          
          // 📍 VERTICAL OFFSET: Adjust these values to move items up/down
          // Negative = up, Positive = down
          const offsetY = isSmall ? -10 : 215;  // 🔧 Vertical offset (mobile: -10, desktop: -15)

          // Calculate position relative to wrapper
          let itemX = screen2.x - wrapperRect.left + offsetX;
          let itemY = screen2.y - wrapperRect.top + offsetY;

          // 🔧 VIEWPORT BOUNDS: Keep items within wrapper bounds
          // Estimate item dimensions (will be refined when element is visible)
          const estimatedWidth = isSmall ? 200 : 300;
          const estimatedHeight = isSmall ? 80 : 60;
          
          // Get actual dimensions if element is visible
          const itemRect = el.getBoundingClientRect();
          const itemWidth = itemRect.width > 0 ? itemRect.width : estimatedWidth;
          const itemHeight = itemRect.height > 0 ? itemRect.height : estimatedHeight;

          // Keep items within horizontal bounds
          const minLeft = 10;  // 🔧 MIN LEFT: Minimum distance from left edge
          const minRight = 10; // 🔧 MIN RIGHT: Minimum distance from right edge
          
          if (itemX < minLeft) {
            itemX = minLeft;
          } else if (itemX + itemWidth > wrapperRect.width - minRight) {
            itemX = wrapperRect.width - itemWidth - minRight;
          }

          // Keep items within vertical bounds
          const minTop = 10;    // 🔧 MIN TOP: Minimum distance from top edge
          const minBottom = 10; // 🔧 MIN BOTTOM: Minimum distance from bottom edge
          
          if (itemY < minTop) {
            itemY = minTop;
          } else if (itemY + itemHeight > wrapperRect.height - minBottom) {
            itemY = wrapperRect.height - itemHeight - minBottom;
          }

          gsap.set(el, {
            left: itemX,
            top: itemY,
          });

          gsap.to(el, {
            autoAlpha: active ? 1 : 0,
            scale: active ? 1 : 0.85,
            duration: 0.35,
            ease: "power3.out",
          });
        });
      },
    });
  }, [breakpoint, dotSize]);

  return (
    <section
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        marginTop: breakpoint === "mobile" ? "100px" : "200px",
        ...(breakpoint !== "mobile"
          ? { maxWidth: "1152px", marginLeft: "auto", marginRight: "auto" }
          : {}),
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 990 3930"
        preserveAspectRatio="xMidYMin meet"
        style={{
          width: "100%",
          height: "auto",
          position: "absolute",
          top: breakpoint === "mobile" ? "150px" : "300px",
          left: 0,
          pointerEvents: "none",
        }}
        fill="none"
      >
        <path
          ref={pathRef}
          d="M2.50061 2.50049L73.5006 161.5C84.5006 177 90.5006 207.5 152.001 287C249.454 412.977 359.501 517.5 382.501 550.5C405.501 583.5 398.804 594.687 409.251 623C419.697 651.314 388.834 713.834 436.001 695.5C483.167 677.167 566.401 663.7 522.001 756.5C477.601 849.3 568.374 1038.16 615.001 963C630.116 938.636 605.901 922.9 635.501 892.5C665.101 862.1 695.001 845 706.501 838.5C718.001 832 737.751 823.401 756.501 818C772.327 813.442 799.501 812 811.501 809.5C823.501 807 851.501 818 851.501 818C851.501 818 873.31 825.905 887.001 838.5C906.854 856.766 911.334 888.334 913.001 902.5C914.667 916.667 897.314 937.985 880.501 955.5C865.158 971.483 853.313 977.143 834.001 988C811.651 1000.57 798.367 1007.25 773.501 1013.5C752.525 1018.77 740.121 1020.58 718.501 1020C694.46 1019.35 679.143 1019.96 658.001 1008.5C644.11 1000.97 634.001 987 630.001 977.5C626.001 968 631.1 952.642 635.501 937.5C641.742 916.026 646.83 902.955 662.501 887C673.127 876.181 681.572 872.927 694.501 865C713.932 853.088 724.785 845.421 746.501 838.5C767.392 831.842 780.077 829.604 802.001 830C821.611 830.355 833.066 831.801 851.501 838.5C866.279 843.871 876.789 845.543 887.001 857.5C898.845 871.37 899.501 902.5 899.501 902.5L874.501 943.5C870.501 950.167 858.801 965.4 844.001 973C829.201 980.6 790.834 996.5 773.501 1003.5L718.501 1008.5C718.501 1008.5 688.425 1013.39 674.001 1003.5C653.998 989.791 654.194 967.45 658.001 943.5C660.416 928.306 665.229 920.14 674.001 907.5C686.815 889.035 698.899 881.999 718.501 871C745.354 855.933 784.501 851.5 794.501 850C804.501 848.5 835.403 841.849 851.501 857.5C865.898 871.499 866.75 887.684 863.501 907.5C857.905 941.626 849.069 903.068 819.501 921C766.139 953.362 866.061 834.75 907.501 850C936.37 860.625 943.301 884.4 950.501 916C957.701 947.6 953.501 1010.83 950.501 1038.5C947.501 1066.17 939.158 1071.21 926.501 1089C907.936 1115.1 894.767 1134.57 863.501 1141.5C821.666 1150.78 918.935 1097.3 933.501 1057C943.454 1029.46 942.001 982.5 942.001 982.5C947.001 929.5 931.001 860 919.501 886.5C908.641 911.525 949.082 955.039 926.001 940.5C922.129 938.062 921.401 937 917.001 933C912.601 929 910.805 934.403 909.001 937.5C906.706 941.439 910.22 944.509 911.001 949C911.782 953.492 911.001 966.5 911.001 966.5C911.334 968.334 910.601 971.1 905.001 967.5C899.401 963.9 899.001 971.334 899.501 975.5L905.001 988C908.501 995 913.901 1007.9 907.501 1003.5C899.501 998 889.501 983.5 880.501 975.5C873.301 969.1 853.167 984.167 844.001 992.5L819.501 1003.5V1024.5V1032.5C819.001 1033.83 816.701 1035 811.501 1029C804.501 1021.5 799.501 1016 799.001 1022.5C798.501 1029 807.501 1042 799.001 1034.5C792.201 1028.5 786.501 1024 784.501 1022.5L770.501 1020H756.501L733.001 1022.5L722.501 1032.5V1044.5L724.501 1053.5C724.501 1053.5 725.729 1056.17 726.001 1058C726.931 1064.28 714.501 1046.5 714.501 1046.5C714.667 1044.83 713.301 1040.1 706.501 1034.5C699.701 1028.9 696.667 1032.17 696.001 1034.5C695.334 1036.83 683.001 1026 683.001 1026C683.001 1026 680.866 1023.41 679.001 1022.5C673.286 1019.71 682.001 1038.5 682.001 1038.5C682.001 1038.5 688.667 1046.83 685.001 1044.5C681.334 1042.17 672.901 1035.9 668.501 1029.5C664.101 1023.1 659.667 1018.83 658.001 1017.5C656.334 1016.17 658.001 1026 658.001 1026C658.001 1026 661.38 1030.92 662.501 1034.5C665.26 1043.33 646.001 1017.5 646.001 1017.5C642.667 1015.17 634.201 1007.3 627.001 994.5C619.801 981.7 627.661 976.998 620.001 976C615.577 975.425 609.501 980.5 609.501 980.5C609.501 980.5 580.626 982.528 582.001 994.5C582.822 1001.65 588.111 1004.36 594.001 1008.5C604.662 1016 627.001 1013.5 627.001 1013.5C627.001 1013.5 611.965 1020.5 617.001 1029.5C623.314 1040.79 609.625 1048.26 622.001 1044.5C634.606 1040.67 635.001 1019.5 642.501 1024.5C650.001 1029.5 640.866 1048.51 646.001 1062.5C655.143 1087.41 696.001 1108.5 696.001 1108.5L766.501 1145.5C766.501 1145.5 801.652 1156.1 830.001 1145.5C908.041 1116.32 890.705 900.521 825.001 933C819.267 935.835 800.474 957.713 794.501 960C787.846 962.55 763.554 977.982 756.501 979C743.29 980.908 731.848 982.656 718.501 982.5C706.512 982.361 698.201 985.3 688.001 979C680.936 974.638 681.589 966.369 674.001 963C660.426 956.976 639.501 979 639.501 979L601.001 1024.5V1053.5L607.501 1089C607.501 1089 611.304 1131.93 607.501 1159C600.08 1211.81 577.535 1236.91 552.501 1284C502.948 1377.21 230.501 1494.83 392.001 1501.5C553.501 1508.17 814.201 1544.7 565.001 1637.5C315.801 1730.3 234.834 1819.33 227.501 1856.5C220.167 1893.67 373.513 1971.81 317.501 1968.5C302.371 1967.61 299.136 1967.81 284.001 1967C265.071 1965.99 236.501 1977 236.501 1977C229.167 1980 211.101 1989.1 197.501 2001.5C180.501 2017 162.501 2041.5 164.001 2053.5C165.201 2063.1 168.501 2066.83 170.001 2067.5C171.501 2068.17 183.059 2070.69 191.001 2067.5C211.679 2059.19 231.834 2049 246.001 2049.5C246.001 2049.5 292.801 2055.5 310.001 2047.5C331.501 2037.5 339.501 2027 344.501 2029C348.501 2030.6 352.834 2036.17 352.001 2041C350.834 2045 346.601 2054 339.001 2062C329.501 2072 317.001 2076.5 294.001 2088C271.201 2096.8 227.501 2098.67 208.501 2098.5L179.501 2088C179.501 2088 166.688 2083.92 164.001 2077C160.02 2066.75 172.275 2061.79 179.501 2053.5C193.951 2036.93 226.501 2022.5 226.501 2022.5L258.001 2001.5L284.001 1985.5C284.001 1985.5 328.156 1966.33 322.001 1980C320.956 1982.32 319.448 1983.14 318.501 1985.5C317.972 1986.82 317.195 1987.61 317.501 1989C317.888 1990.76 319.396 1991.18 321.001 1992C322.947 1992.99 326.501 1993 326.501 1993L339.001 1984.5L347.001 1983.5C347.001 1983.5 351.145 1989.15 352.001 1992C352.953 1995.18 352.521 1999.23 351.001 2002.18C349.159 2005.75 339.436 2016.61 334.501 2011.18C332.794 2009.3 333.997 2009.76 333.001 2006.5C332.27 2004.11 344.748 2005.44 343.501 1999.5C342.873 1996.52 346.232 1993.36 343.501 1992C337.773 1989.15 327.001 2000.5 327.001 2000.5L324.001 2001.5L318.501 2000.5C317.501 2000.5 312.801 1996.8 310.001 1994C306.801 1990.4 313.822 1988.29 312.001 1986C309.811 1983.24 309.501 1983 303.001 1985.5C300.225 1986.57 289.501 1992 289.501 1992L282.001 1997L256.001 2015C256.001 2015 244.47 2024.06 236.501 2029C227.888 2034.33 221.957 2035.42 213.501 2041C206.882 2045.37 193.765 2045.89 196.001 2053.5C198.405 2061.68 218.501 2047.5 218.501 2047.5L239.001 2033.5L262.501 2019C262.501 2019 276.312 2009.31 286.501 2006.5C295.38 2004.05 300.959 2002.74 310.001 2004.5C316.872 2005.84 326.501 2011.5 326.501 2011.5C326.501 2011.5 330.383 2016.3 331.001 2020C331.322 2021.93 330.624 2023.08 331.001 2025C332.839 2034.37 351.334 2009.67 352.001 2012.5C352.667 2015.33 355.401 2021.8 361.001 2025C368.001 2029 360.001 2020.5 380.001 2012.5C400.001 2004.5 401.001 2000.5 428.501 1998C450.501 1996 470.667 1997.17 478.001 1998C485.167 1998 500.501 1999.7 504.501 2006.5C509.501 2015 510.001 2016.5 504.501 2025C500.101 2031.8 477.001 2049.5 466.001 2057.5L440.501 2067.5C430.667 2067.17 406.601 2066.06 397.001 2062.46C387.401 2058.86 375.334 2050.83 369.501 2047.5C369.501 2047.5 361.459 2041.22 361.001 2035.5C360.191 2025.38 383.501 2022.5 383.501 2022.5L405.001 2011.5L440.501 2006.5H466.001H486.001C486.001 2006.5 495.551 2007.83 497.501 2012.5C499.473 2017.23 493.501 2025 493.501 2025L478.001 2035.5L444.501 2047.5L413.501 2044C413.501 2044 398.322 2037.34 394.001 2041C388.65 2045.53 416.501 2053.5 416.501 2053.5C416.501 2053.5 429.318 2054.76 437.001 2057.5C458.031 2065 380.001 2059.5 380.001 2059.5L348.501 2067.5C346.667 2068.33 339.301 2069.9 334.501 2075.5C329.701 2084.3 329.819 2085.5 329.501 2089C328.001 2105.5 344.534 2117.77 365.001 2133C386.501 2149 385.834 2143.67 394.001 2147.5L428.501 2158C433.667 2159.83 451.501 2162.4 463.501 2152C475.501 2141.6 481.167 2129.5 482.501 2123.5C483.834 2117.5 475.001 2103.5 463.501 2092C452.001 2080.5 450.101 2081 440.501 2077C414.101 2070.2 397.167 2071 391.001 2070.67C391.001 2070.67 346.35 2067.77 352.001 2082.67C357.413 2096.94 389.001 2083 389.001 2083C389.001 2083 412.497 2080.73 426.001 2086C437.102 2090.34 451.001 2103.5 451.001 2103.5C451.001 2103.5 469.456 2116.35 466.001 2126.5C464.566 2130.72 459.001 2135.5 459.001 2135.5C454.667 2138.5 445.701 2143.8 416.501 2133C387.301 2122.2 365.667 2108.83 358.501 2103.5C358.501 2103.5 350.839 2087.78 342.001 2088C329.635 2088.32 357.688 2110.72 348.501 2119C339.415 2127.19 330.167 2110.67 318.501 2110C306.834 2109.33 279.001 2108.4 249.001 2110C219.001 2111.6 208.501 2110 194.001 2121.5C179.501 2133 196.368 2173.99 231.501 2196C255.004 2210.73 274.578 2201.34 301.501 2208C388.227 2229.47 424.298 2274.13 504.501 2313.5C603.335 2362.01 680.035 2355.89 761.001 2430.5C915.044 2572.45 957.834 2886.17 863.501 2957C769.167 3027.83 633.201 3175.7 844.001 3200.5C1054.8 3225.3 986.834 3360.17 926.501 3424.5C866.167 3488.83 669.939 3413.95 712.001 3525C739.887 3598.62 870.256 3605.28 844.001 3679.5C818.001 3753 461.427 3380.99 485.501 3583C497.001 3679.5 569.493 3596.69 635.501 3663.5C677.686 3706.2 640.379 3791.04 691.501 3822.5C755.7 3862.01 771.108 3853.79 844.001 3873C881.236 3882.81 926.501 3927 926.501 3927"
          stroke="black"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>

      {/* 🎯 DROP DOT - stretches into drop shape when moving fast */}
      <canvas
        ref={canvasRef}
        width={dotSize}
        height={dotSize}
        style={{
          position: "absolute",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* TIMELINE ITEMS */}
      {TIMELINE_STEPS.map((step, i) => (
        <div
          key={i}
          ref={(el) => (itemRefs.current[i] = el)}
          style={{
            position: "absolute",
            opacity: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 4,
            pointerEvents: "none",
            // 🔧 MAX WIDTH: Adjust to control how wide items can be
            maxWidth: breakpoint === "mobile" ? "200px" : "400px",
          }}
        >
          {breakpoint === "mobile" ? (
            <div 
              className="flex flex-col items-start gap-2"
              style={{
                // 🔧 GAP: Adjust gap between image and text (currently 8px = 0.5rem)
                gap: "8px",
                marginTop: breakpoint === "mobile" ? "100px": "20px"
              }}
            >
              <img
                src={productConfig.images[step.imageKey]}
                width={step.final ? 48 : 80}
                alt=""
                style={{
                  // 🔧 IMAGE SIZE: Adjust image dimensions here
                  width: step.final ? "48px" : "30px",
                  height: "auto",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  // 🔧 TEXT STYLING: Adjust font size, color, etc.
                  fontSize: "14px",
                  lineHeight: "1.4",
                  wordWrap: "break-word",
                  maxWidth: "100%",
                  color: "#000",
                }}
              >
                {step.label}
              </span>
            </div>
          ) : (
            <div 
              className="flex items-center gap-2"
              style={{
                // 🔧 GAP: Adjust gap between image and text (currently 8px = 0.5rem)
                gap: "12px",
              }}
            >
              <img
                src={productConfig.images[step.imageKey]}
                width={step.final ? 48 : 80}
                alt=""
                style={{
                  // 🔧 IMAGE SIZE: Adjust image dimensions here
                  width: step.final ? "48px" : "80px",
                  height: "auto",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  // 🔧 TEXT STYLING: Adjust font size, color, etc.
                  fontSize: "16px",
                  lineHeight: "1.4",
                  wordWrap: "break-word",
                  maxWidth: "220px",
                  color: "#000",
                }}
              >
                {step.label}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* HEADINGS / PARAGRAPH / QUOTE */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "8%",
          color: "#000",
          zIndex: 4,
        }}
      >
        <div
          style={{
            // fontFamily: "'Permanent_Marker-Regular', Helvetica",
            // fontSize: breakpoint === "mobile" ? "24px" : "54px",
            // lineHeight: "1.05",
            fontSize: breakpoint === "mobile" ? "24px" : breakpoint === "tablet" ? "36px" : "74px",
            fontFamily: "'Montserrat', 'Oswald', 'Permanent Marker', Arial, sans-serif",
            lineHeight: "1.05",
          }}
        >
          {productConfig.heading2}
        </div>
        <p
          style={{
            marginTop: "12px",
            maxWidth: breakpoint === "mobile" ? "100%" : "520px",
            fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
            fontSize: breakpoint === "mobile" ? "14px" : breakpoint === "tablet" ? "18px" : "24px",
            lineHeight: "1.1",
          }}
        >
          {productConfig.paragraph2}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          top: breakpoint === "mobile" ? "55%" : "70%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#000",
          zIndex: 4,
          textAlign: "center",
          maxWidth: breakpoint === "mobile" ? "100%" : "600px",
          padding: breakpoint !== "desktop" ? "80px 20px" : "150px 20px",
        }}
      >
        <div
          style={{
            fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
            fontSize: breakpoint === "mobile" ? "18px" : "28px",
            lineHeight: "1.3",
            fontStyle: "italic",
          }}
        >
          "{productConfig.quote || "Nature's sweetest gift, packed with energy and tradition"}"
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "8%",
          color: "#000",
          zIndex: 4,
        }}
      >
        <div
          style={{
            // fontFamily: "'Permanent_Marker-Regular', Helvetica",
            // fontSize: breakpoint === "mobile" ? "24px" : "54px",
            // lineHeight: "1.05",
            fontSize: breakpoint === "mobile" ? "24px" : breakpoint === "tablet" ? "36px" : "74px",
            fontFamily: "'Montserrat', 'Oswald', 'Permanent Marker', Arial, sans-serif",
            lineHeight: "1.05",
          }}
        >
          {productConfig.heading2}
        </div>
        <p
          style={{
            marginTop: "12px",
            maxWidth: breakpoint === "mobile" ? "100%" : "520px",
            fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
            fontSize: breakpoint === "mobile" ? "14px" : "22px",
            lineHeight: "1.1",
          }}
        >
          {productConfig.paragraph2}
        </p>
        {onOpenDetails && (
          <button
            onClick={onOpenDetails}
            style={{
              marginTop: "20px",
              padding:
                breakpoint === "mobile"
                  ? "5px 10px"
                  : breakpoint === "tablet"
                  ? "12px 24px"
                  : "14px 28px",
              fontFamily: "'Permanent_Marker-Regular', Helvetica",
              fontSize:
                breakpoint === "mobile"
                  ? "12px"
                  : breakpoint === "tablet"
                  ? "20px"
                  : "22px",
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
      </div>
    </section>
  );
};

export default DatesTimeline;



