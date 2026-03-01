import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const pathStrokeRef = useRef(null);
  const lineRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!svgRef.current || !pathRef.current || !pathStrokeRef.current || !containerRef.current) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    
    // Set initial stroke-dasharray and stroke-dashoffset to hide the path
    pathStrokeRef.current.style.strokeDasharray = pathLength;
    pathStrokeRef.current.style.strokeDashoffset = pathLength;

    // Create timeline for the entire animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Ensure minimum display time of 3 seconds
        const elapsed = Date.now() - startTimeRef.current;
        const minDuration = 3000;
        const remainingTime = Math.max(0, minDuration - elapsed);
        
        setTimeout(() => {
          // Fade out animation
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: onComplete,
          });
        }, remainingTime);
      },
    });

    // Animate path drawing - slower and more flowing
    tl.to(pathStrokeRef.current, {
      strokeDashoffset: 0,
      duration: 3.5,
      ease: "power1.inOut",
    });

    // Animate line along the path (drawing effect)
    const updateLineDrawing = (progress) => {
      if (!lineRef.current) return;
      
      const linePath = lineRef.current.querySelector('path');
      if (!linePath) return;
      
      // Initialize stroke-dasharray if not already set
      if (!linePath.style.strokeDasharray) {
        linePath.style.strokeDasharray = pathLength;
        linePath.style.strokeDashoffset = pathLength;
      }
      
      // Calculate the length of path to show
      const lineLength = pathLength * progress;
      
      // Set stroke-dasharray and stroke-dashoffset to show only the portion up to current progress
      linePath.style.strokeDashoffset = pathLength - lineLength;
    };

    // Animate line drawing along the path
    const progressObj = { value: 0 };
    
    // Set initial state
    updateLineDrawing(0);
    
    gsap.to(progressObj, {
      value: 1,
      duration: 3.5,
      ease: "power1.inOut",
      onUpdate: function() {
        updateLineDrawing(progressObj.value);
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        width="314"
        height="717"
        viewBox="0 0 314 717"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
        }}
      >
        {/* Original path (hidden, used for calculations) */}
        <path
          ref={pathRef}
          d="M0.675537 242.055L233.206 0.346646L132.247 242.055L312.676 459.43L0.675537 716.347L187.389 459.43L0.675537 242.055Z"
          stroke="transparent"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Animated stroke path */}
        <path
          ref={pathStrokeRef}
          d="M0.675537 242.055L233.206 0.346646L132.247 242.055L312.676 459.43L0.675537 716.347L187.389 459.43L0.675537 242.055Z"
          stroke="#FFD700"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Line following the path */}
      <svg
        ref={lineRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          zIndex: 10,
          pointerEvents: "none",
        }}
        viewBox="0 0 314 717"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.675537 242.055L233.206 0.346646L132.247 242.055L312.676 459.43L0.675537 716.347L187.389 459.43L0.675537 242.055Z"
          stroke="#FFD700"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export default LoadingScreen;

