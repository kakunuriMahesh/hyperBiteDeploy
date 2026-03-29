import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaBolt, FaUsers, FaHeart, FaSyncAlt, FaLeaf, FaFlask, FaRunning } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const HyperBiteManifesto = () => {
  const mainRef = useRef(null);
  const leftSideRef = useRef(null);
  const dynamicTextRef = useRef(null);

  const sections = [
    {
      id: "story",
      label: "Story",
      subtitle: "More than a snack — a way of life.",
      description: "At HyperBite, we believe that what you put into your body should do more than just satisfy hunger, it should fuel your next big move. Whether you are hitting a personal best in the gym, outsmarting an opponent on the chessboard, or riding across the rugged terrains of India, we are right there in your pocket.",
      cards: [
        { title: "Fueling Potential", icon: <FaBolt />, text: "We provide energy for your Hyper-Life — physical, mental, and adventurous." },
        { title: "Radical Community", icon: <FaUsers />, text: "From ride challenges to fitness battles, we grow stronger by pushing each other forward." },
        { title: "Purposeful Giving", icon: <FaHeart />, text: "Through our 'Bite Back' program, your growth helps improve children's health." },
        { title: "Continuous Evolution", icon: <FaSyncAlt />, text: "We evolve with you — constantly improving recipes based on feedback." }
      ]
    },
    {
      id: "mission",
      label: "Mission",
      description: "To fuel the extraordinary in the everyday — powering a community that dreams bigger, moves faster, and gives back harder.",
    },
    {
      id: "promise",
      label: "Promise",
      description: "HyperBite stands as a solid brand for those who look for real products. We don’t chase trends — we set the standard for what modern nutrition should be.",
    },
    {
      id: "manifesto",
      label: "Core Manifesto",
      description: "Our philosophy is built on three unbreakable pillars of modern nutrition.",
      cards: [
        { title: "Zero Compromise on Sweetness", icon: <FaLeaf />, text: "No added sugar, syrup, or jaggery. Only Raw Honey and Dates." },
        { title: "Research-Led, Not Market-Led", icon: <FaFlask />, text: "We are in the lab researching products with real biochemical integrity." },
        { title: "Engineered for the Modern Nomad", icon: <FaRunning />, text: "Designed for fast, mobile lifestyles — from trekking to long flights." }
      ]
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. PINNING THE LEFT SIDE (Desktop)
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftSideRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      // 2. TEXT SWAPPING ANIMATION
      const sectionElements = document.querySelectorAll(".manifesto-content-block");
      
      sectionElements.forEach((section) => {
        const label = section.getAttribute("data-label");
        
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => swapText(label),
          onEnterBack: () => swapText(label),
        });
      });

      function swapText(newLabel) {
        gsap.to(dynamicTextRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            dynamicTextRef.current.innerText = newLabel;
            gsap.fromTo(dynamicTextRef.current, 
              { y: 20, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
            );
          }
        });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative w-full bg-[#fdfdfd] text-[#0f172a] font-sans overflow-x-clip">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: FIXED/STICKY HEADER */}
        <div 
          ref={leftSideRef} 
          className="w-full md:w-[40%] h-[20vh] md:h-screen flex items-center pt-[20%] md:pt-0 px-6 md:px-12 z-50 bg-[#fdfdfd]/80 backdrop-blur-md md:bg-transparent"
        >
          <div className="flex flex-row md:flex-col items-baseline md:items-start gap-3 md:gap-0">
            <h2 className="text-3xl md:text-8xl font-black tracking-tighter text-[#545454] uppercase leading-none">
              OUR
            </h2>
            <h2 
              ref={dynamicTextRef} 
              className="text-4xl md:text-8xl font-black tracking-tighter text-[#0f172a] leading-none transition-all duration-300"
            >
              Story
            </h2>
          </div>
        </div>

        {/* RIGHT COLUMN: SCROLLING CONTENT */}
        <div className="w-full md:w-[60%] px-6 md:px-12 py-12 md:py-32 flex flex-col gap-32 md:gap-[40vh]">
          {sections.map((section) => (
            <div 
              key={section.id} 
              data-label={section.label} 
              className="manifesto-content-block flex flex-col gap-8 md:gap-12"
            >
              <div className="max-w-xl">
                {section.subtitle && (
                  <p className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
                    {section.subtitle}
                  </p>
                )}
                <p className="text-lg md:text-2xl text-gray-500 leading-relaxed font-medium">
                  {section.description}
                </p>
              </div>

              {/* CARD GRID LAYOUT */}
              {section.cards && (
                <div className={`grid gap-6 ${section.id === 'manifesto' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {section.cards.map((card, idx) => (
                    <div 
                      key={idx} 
                      className="group p-8 md:p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#f8fafc] text-3xl mb-8 group-hover:scale-110 transition-transform duration-500">
                        {card.icon}
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold mb-4 tracking-tight">
                        {card.title}
                      </h4>
                      <p className="text-gray-500 text-base md:text-lg leading-snug">
                        {card.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER PADDING */}
      <div className="h-[20vh] w-full bg-white"></div>
    </div>
  );
};

export default HyperBiteManifesto;

// import React, { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

// const HyperBiteManifesto = () => {
//   const componentRef = useRef(null);
//   const leftSideRef = useRef(null);
//   const headerTextRef = useRef(null);

//   const data = [
//     { id: "story", label: "Story", content: "At HyperBite, we believe that what you put into your body should do more than just satisfy hunger...", subtitle: "More than a snack — a way of life." },
//     { id: "mission", label: "Mission", content: "To fuel the extraordinary in the everyday — powering a community that dreams bigger." },
//     { id: "promise", label: "Promise", content: "HyperBite stands as a solid brand for those who look for real products. We don’t chase trends." },
//     { id: "manifesto", label: "Core Manifesto", content: "Zero compromise on sweetness. No added sugar, syrup, or jaggery. Only Raw Honey and Dates." }
//   ];

//   useEffect(() => {
//     // We use gsap.context for clean scoping and to prevent memory leaks
//     let ctx = gsap.context(() => {
      
//       // 1. THE PINNING LOGIC (The Fix)
//       // This pins the entire left column for the duration of the right column's scroll
//       ScrollTrigger.create({
//         trigger: componentRef.current,
//         start: "top top", // Starts pinning when the top of the section hits the top of the viewport
//         end: "bottom bottom", // Unpins when the bottom of the section hits the bottom of the viewport
//         pin: leftSideRef.current,
//         pinSpacing: false, // Prevents weird gaps at the bottom
//         markers: false, // Set to true to debug the start/end lines
//       });

//       // 2. THE TEXT UPDATE LOGIC
//       const sections = document.querySelectorAll(".scroll-section");
//       sections.forEach((section) => {
//         const label = section.getAttribute("data-label");
        
//         ScrollTrigger.create({
//           trigger: section,
//           start: "top center",
//           end: "bottom center",
//           onEnter: () => updateHeader(label),
//           onEnterBack: () => updateHeader(label),
//         });
//       });

//       function updateHeader(text) {
//         gsap.to(headerTextRef.current, {
//           y: -30,
//           opacity: 0,
//           duration: 0.25,
//           ease: "power2.in",
//           onComplete: () => {
//             headerTextRef.current.innerText = text;
//             gsap.fromTo(headerTextRef.current, 
//               { y: 30, opacity: 0 }, 
//               { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
//             );
//           }
//         });
//       }
//     }, componentRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={componentRef} className="relative w-full bg-white">
//       {/* LAYOUT STRUCTURE:
//           Desktop: 2 Columns (Left Pins, Right Scrolls)
//           Mobile: Stacked (Pins disappear or turn into a top bar)
//       */}
//       <div className="flex flex-col md:flex-row max-w-[1440px] mx-auto">
        
//         {/* LEFT SIDE: This is what we PIN */}
//         <div 
//           ref={leftSideRef} 
//           className="w-full md:w-1/2 h-[20vh] md:h-screen flex items-center px-10 md:px-20 z-50 bg-white"
//         >
//           <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase flex gap-4">
//             <span className="text-gray-200">OUR</span>
//             <span ref={headerTextRef} className="text-black">Story</span>
//           </h2>
//         </div>

//         {/* RIGHT SIDE: The Scrollable Content */}
//         <div className="w-full md:w-1/2 px-10 md:px-20 pb-[20vh]">
//           {data.map((item) => (
//             <section 
//               key={item.id} 
//               data-label={item.label} 
//               className="scroll-section min-h-[60vh] md:min-h-screen flex flex-col justify-center py-20 border-b border-gray-100 last:border-0"
//             >
//               {item.subtitle && (
//                 <p className="text-[#0f172a] text-xl md:text-2xl font-medium mb-6 italic">
//                   {item.subtitle}
//                 </p>
//               )}
//               <p className="text-gray-500 text-lg md:text-2xl leading-relaxed max-w-lg">
//                 {item.content}
//               </p>
              
//               {/* Add your specific cards from the screenshots here */}
//               {item.id === "story" && (
//                 <div className="grid grid-cols-1 gap-4 mt-10">
//                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
//                       <h4 className="font-bold text-xl">Fueling Potential</h4>
//                       <p className="text-gray-500 mt-2">Energy for your physical, mental, and adventurous life.</p>
//                    </div>
//                 </div>
//               )}
//             </section>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HyperBiteManifesto;



