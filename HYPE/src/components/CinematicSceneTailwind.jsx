import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiRotateCcw, FiChevronDown } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  {
    name: "The Daily Hustle",
    bg: "/assets/ADV_Screens_HyperBite/bg-1.png",
    chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-1.png" }],
    dialogue: [{ text: "Uff... another long day ahead.", top: "30%", left: "50%" }],
    light: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 100%)"
  },
  {
    name: "The Heavy Burden",
    bg: "/assets/ADV_Screens_HyperBite/bg-2.png",
    chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-2.png" }],
    dialogue: [
      { text: "Why so nervous?", top: "35%", left: "35%" },
      { text: "Too much work, no time for myself.", top: "30%", left: "75%" }
    ],
    light: "linear-gradient(to bottom, rgba(0,120,255,0.15) 0%, rgba(0,0,0,0) 100%)"
  },
  {
    name: "A Natural Solution",
    bg: "/assets/ADV_Screens_HyperBite/bg-3.png",
    chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-3.png" }],
    dialogue: [
      { text: "No papa its HyperBite. it has Raw honey & zero added sugar.", top: "22%", left: "30%" },
      { text: "No! snacks are not good for kids", top: "28%", left: "70%" }
    ],
    light: "linear-gradient(to bottom, rgba(255,100,0,0.15) 0%, rgba(0,0,0,0) 100%)"
  },
  {
    name: "The Energy Burst",
    bg: "/assets/ADV_Screens_HyperBite/bg-4.png",
    chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-4.png" }],
    dialogue: [
      { text: "Amazing its delicious!", top: "25%", left: "45%" },
      { text: "Yes! very nice texture.", top: "22%", left: "75%" }
    ],
    light: "linear-gradient(to bottom, rgba(50,255,50,0.1) 0%, rgba(0,0,0,0) 100%)"
  },
  {
    name: "Ready for Anything",
    bg: "/assets/ADV_Screens_HyperBite/bg-5.png",
    chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-5.png" }],
    dialogue: [
      { text: "It's like a nutrient bomb.", top: "35%", left: "70%" },
      { text: "Easy to carry for travel.", top: "30%", left: "40%" }
    ],
    light: "linear-gradient(to bottom, rgba(0,200,255,0.12) 0%, rgba(0,0,0,0) 100%)"
  },
  {
    name: "HyperBite Lifestyle",
    bg: "/assets/ADV_Screens_HyperBite/bg-6.png",
    chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-6.png" }],
    dialogue: [
      { text: "Wow feel the taste!", top: "30%", left: "70%" },
      { text: "Exactly we all are enjoying.", top: "30%", left: "50%" }
    ],
    light: "linear-gradient(to bottom, rgba(180,50,255,0.15) 0%, rgba(0,0,0,0) 100%)"
  }
];

export default function HyperBiteProEngine() {
  const container = useRef();
  const bgRef = useRef();
  const charRef = useRef();
  const lightingRef = useRef();
  const titleRef = useRef();
  const dialogueRefs = useRef([]);
  const currentIdxRef = useRef(-1);
  const stRef = useRef(null);

  const addDialogueRef = (el) => { if (el && !dialogueRefs.current.includes(el)) dialogueRefs.current.push(el); };

  const handleReset = () => {
    if (stRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      currentIdxRef.current = -1;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=32000",
        pin: true,
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          const total = scenes.length;
          const idx = Math.min(Math.floor(progress * total), total - 1);
          const segment = (progress * total) % 1;
          const s = scenes[idx];

          if (segment > 0.1 && segment < 0.3 && currentIdxRef.current !== idx) {
            bgRef.current.setAttribute("href", s.bg);
            charRef.current.setAttribute("href", s.chars[0].src);
            lightingRef.current.style.background = s.light;
            titleRef.current.textContent = s.name;
            currentIdxRef.current = idx;
          }

          // ANIMATION PHASES
          if (segment < 0.25) {
            const p = segment / 0.25;
            const rot = gsap.utils.interpolate(0, 90, p);
            bgRef.current.style.transform = `rotateX(${rot}deg)`;
            charRef.current.style.transform = `rotateX(${rot}deg)`;
            charRef.current.style.opacity = 1 - p;
            bgRef.current.style.filter = "blur(0px)";
            titleRef.current.style.opacity = p > 0.6 ? 1 : 0;
            dialogueRefs.current.forEach(d => { d.style.opacity = 0; d.textContent = ""; });
          }
          else if (segment >= 0.25 && segment < 0.55) {
            const p = (segment - 0.25) / 0.3;
            const bgP = Math.min(1, p * 1.3);
            const charP = Math.max(0, (p - 0.2) * 1.25);
            const swing = (prog) => Math.sin(prog * Math.PI * 3) * (1 - prog) * 8;
            bgRef.current.style.transform = `rotateX(${gsap.utils.interpolate(90, 0, bgP) + swing(bgP)}deg)`;
            charRef.current.style.transform = `rotateX(${gsap.utils.interpolate(90, 0, charP) + swing(charP)}deg)`;
            charRef.current.style.opacity = charP > 0 ? 1 : 0;
            titleRef.current.style.opacity = 1 - (p * 2);
            lightingRef.current.style.opacity = 0.8; 
            dialogueRefs.current.forEach(d => d.style.opacity = 0);
          }
          else {
            const p = (segment - 0.55) / 0.45;
            bgRef.current.style.transform = "rotateX(0deg)";
            charRef.current.style.transform = "rotateX(0deg)";
            bgRef.current.style.filter = `blur(${Math.min(p * 40, 25)}px)`;
            dialogueRefs.current.forEach((d, i) => {
              const diag = s.dialogue[i];
              if (diag) {
                d.textContent = diag.text;
                d.style.top = diag.top;
                d.style.left = diag.left;
                d.style.opacity = gsap.utils.clamp(0, 1, (p - 0.1) * 4);
              }
            });
          }
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="bg-white w-full h-screen relative overflow-hidden font-sans">
      
      <div ref={lightingRef} className="fixed inset-0 pointer-events-none z-0 opacity-0 transition-all duration-700" />

      {/* Title stayed at 2/3 */}
      <h1 ref={titleRef} className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-black md:text-black/10 text-5xl md:text-9xl font-black uppercase tracking-tighter opacity-0 pointer-events-none text-center">
        Happy HyperBite
      </h1>

      {/* UI Container moved to items-end to push screen down */}
      <div className="absolute inset-0 flex items-end justify-center w-full h-screen z-10 pb-14" style={{ perspective: "3000px", perspectiveOrigin: "50% 80%" }}>
        
        {/* Dialogue Boxes */}
        {[0, 1].map(i => (
          <div 
            key={i} 
            ref={addDialogueRef} 
            className="absolute text-white text-[10px] md:text-sm font-bold px-2 md:px-7 py-2 md:py-5 rounded-2xl pointer-events-none z-[100] -translate-x-1/2 select-none"
            style={{ 
              background: "rgba(0, 0, 0, 0.85)", 
              backdropFilter: "blur(20px)", 
              border: "1px solid rgba(255, 255, 255, 0.15)", 
              maxWidth: "360px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
            }}
          />
        ))}

        {/* Larger SVG scale */}
        <svg viewBox="0 0 1200 700" className="w-[96vw] h-[80vh] overflow-visible">
          <defs>
            <clipPath id="pageClip">
              <rect x="100" y="50" width="1000" height="580" rx="32" />
            </clipPath>
          </defs>

          <image 
            ref={bgRef} 
            x="100" y="50" width="1000" height="580" 
            preserveAspectRatio="xMidYMid slice" 
            clipPath="url(#pageClip)"
            style={{ transformOrigin: "50% 630px" }}
          />
          
          <image 
            ref={charRef} 
            x="100" y="50" width="1000" height="580" 
            preserveAspectRatio="xMidYMid slice" 
            style={{ transformOrigin: "50% 630px" }}
          />
          
          {/* Hinge physically matches the lower position */}
          <rect x="40" y="630" width="1120" height="36" fill="#222" rx="18" />
          <rect x="40" y="630" width="1120" height="3" fill="rgba(255, 255, 255, 0.2)" />
        </svg>

        {/* Control Buttons */}
        <div className="absolute bottom-10 left-10 flex flex-col gap-4 z-[100]">
          <button onClick={handleReset} className="p-5 rounded-full bg-black/5 border border-black/10 text-black/30 hover:text-black hover:bg-black/10 transition-all active:scale-95">
            <FiRotateCcw size={24} />
          </button>
          <button onClick={() => window.scrollBy({top: 6000, behavior: 'smooth'})} className="p-5 rounded-full bg-black/5 border border-black/10 text-black/30 hover:text-black hover:bg-black/10 transition-all active:scale-95">
            <FiChevronDown size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

// import React, { useRef, useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { FiRotateCcw, FiChevronDown } from "react-icons/fi";

// gsap.registerPlugin(ScrollTrigger);

// const scenes = [
//   {
//     name: "The Daily Hustle",
//     bg: "/assets/ADV_Screens_HyperBite/bg-1.png",
//     chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-1.png" }],
//     dialogue: [
//       { text: "Uff... another long day ahead.", top: "22%", left: "50%" },
//       { text: "Low energy already?", top: "32%", left: "50%" }
//     ],
//     light: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 80%)"
//   },
//   {
//     name: "The Heavy Burden",
//     bg: "/assets/ADV_Screens_HyperBite/bg-2.png",
//     chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-2.png" }],
//     dialogue: [
//       { text: "Why so nervous?", top: "25%", left: "45%" },
//       { text: "Too much work, no time for myself.", top: "35%", left: "75%" }
//     ],
//     light: "radial-gradient(circle, rgba(0,150,255,0.15) 0%, transparent 80%)"
//   },
//   {
//     name: "A Natural Solution",
//     bg: "/assets/ADV_Screens_HyperBite/bg-3.png",
//     chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-3.png" }],
//     dialogue: [
//       { text: "Raw honey & zero added sugar.", top: "18%", left: "20%" },
//       { text: "Finally! Something healthy for kids.", top: "28%", left: "70%" }
//     ],
//     light: "radial-gradient(circle, rgba(255,100,0,0.2) 0%, transparent 80%)"
//   },
//   {
//     name: "The Energy Burst",
//     bg: "/assets/ADV_Screens_HyperBite/bg-4.png",
//     chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-4.png" }],
//     dialogue: [
//       { text: "Amazing its delicious!", top: "30%", left: "55%" },
//       { text: "Yes! very nice texture.", top: "20%", left: "75%" }
//     ],
//     light: "radial-gradient(circle, rgba(40,200,40,0.15) 0%, transparent 80%)"
//   },
//   {
//     name: "Ready for Anything",
//     bg: "/assets/ADV_Screens_HyperBite/bg-5.png",
//     chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-5.png" }],
//     dialogue: [
//       { text: "It's like a nutrient bomb.", top: "28%", left: "70%" },
//       { text: "Easy to carry for travel.", top: "38%", left: "40%" }
//     ],
//     light: "radial-gradient(circle, rgba(0,200,255,0.15) 0%, transparent 80%)"
//   },
//   {
//     name: "HyperBite Lifestyle",
//     bg: "/assets/ADV_Screens_HyperBite/bg-6.png",
//     chars: [{ src: "/assets/ADV_Screens_HyperBite/fg-6.png" }],
//     dialogue: [
//       { text: "Wow feel the taste!", top: "35%", left: "70%" },
//       { text: "Exactly we all are enjoying.", top: "25%", left: "50%" }
//     ],
//     light: "radial-gradient(circle, rgba(150,50,255,0.2) 0%, transparent 80%)"
//   }
// ];

// export default function HyperBiteProEngine() {
//   const container = useRef();
//   const bgRef = useRef();
//   const charRef = useRef();
//   const lightingRef = useRef();
//   const titleRef = useRef();
//   const dialogueRefs = useRef([]);
//   const currentIdxRef = useRef(-1);

//   // Custom Bounce for the "Swing"
//   const figmaEase = "cubic-bezier(0.34, 1.56, 0.64, 1)";
//   const addDialogueRef = (el) => { if (el && !dialogueRefs.current.includes(el)) dialogueRefs.current.push(el); };

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       ScrollTrigger.create({
//         trigger: container.current,
//         start: "top top",
//         end: "+=22000", // More space for slower, natural feel
//         pin: true,
//         scrub: 1, // Smoother scrub
//         onUpdate: (self) => {
//           const progress = self.progress;
//           const total = scenes.length;
//           const idx = Math.min(Math.floor(progress * total), total - 1);
//           const segment = (progress * total) % 1;

//           const s = scenes[idx];
//           const bg = bgRef.current;
//           const char = charRef.current;
//           const light = lightingRef.current;
//           const title = titleRef.current;

//           // CONTENT SWAP (Mid-Transition while board is flat/invisible)
//           if (segment > 0.3 && segment < 0.5 && currentIdxRef.current !== idx) {
//             bg.setAttribute("href", s.bg);
//             char.setAttribute("href", s.chars[0].src);
//             light.style.background = s.light;
//             title.textContent = s.name;
//             currentIdxRef.current = idx;
//           }

//           // PHASE 1: FALL BACK & TITLE REVEAL (0.0 - 0.4)
//           // Increased gap here so title is seen clearly
//           if (segment < 0.4) {
//             const p = segment / 0.4;
            
//             const rot = gsap.utils.interpolate(0, 90, p);
//             bg.style.transform = `rotateX(${rot}deg)`;
//             char.style.transform = `rotateX(${rot}deg)`;
//             char.style.opacity = 1 - p;

//             title.style.opacity = p > 0.8 ? 1 : p * 1.2;
//             title.style.transform = `translate(-50%, -50%) scale(${0.9 + p * 0.1})`;

//             dialogueRefs.current.forEach(d => { d.style.opacity = 0; d.textContent = ""; });
//           }

//           // PHASE 2: SEQUENTIAL LIFT & SWING (0.4 - 0.8)
//           else if (segment >= 0.4 && segment < 0.8) {
//             const p = (segment - 0.4) / 0.4;
            
//             // Sequential timing: BG opens first, Char waits until BG is halfway up
//             const bgP = Math.min(1, p * 1.3);
//             const charP = Math.max(0, (p - 0.3) * 1.4);

//             // The "Swing" math
//             const swing = (prog) => Math.sin(prog * Math.PI * 3) * (1 - prog) * 10;

//             // BG Lift
//             const bgRot = gsap.utils.interpolate(90, 0, bgP) + swing(bgP);
//             bg.style.transform = `rotateX(${bgRot}deg)`;
//             bg.style.opacity = 1;

//             // Character Swing (Lifts with a delay and its own bounce)
//             const charRot = gsap.utils.interpolate(90, 0, charP) + swing(charP);
//             char.style.transform = `rotateX(${charRot}deg)`;
//             char.style.opacity = charP > 0 ? 1 : 0;

//             // Fade title out slowly as the scene stands up
//             title.style.opacity = 1 - (p * 2);
//           }

//           // PHASE 3: FOCUS / BLUR / DIALOGUE (0.8 - 1.0)
//           else {
//             const p = (segment - 0.8) / 0.2;
//             bg.style.transform = "rotateX(0deg)";
//             char.style.transform = "rotateX(0deg)";
//             bg.style.filter = `blur(${p * 22}px)`;

//             dialogueRefs.current.forEach((d, i) => {
//               const diag = s.dialogue[i];
//               if (diag) {
//                 d.textContent = diag.text;
//                 d.style.top = diag.top;
//                 d.style.left = diag.left;
//                 // Staggered entry for dialogues
//                 d.style.opacity = gsap.utils.mapRange(0.2, 0.8, 0, 1, p);
//               }
//             });
//           }
//         }
//       });
//     }, container);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={container} className="bg-[#020202] w-full h-screen relative overflow-hidden font-sans">
      
//       <div ref={lightingRef} className="absolute inset-0 pointer-events-none z-0 opacity-50 transition-all duration-1000" />

//       {/* Floating Scene Title */}
//       <h1 ref={titleRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-white text-5xl md:text-8xl font-black uppercase tracking-tighter opacity-0 pointer-events-none text-center drop-shadow-2xl mix-blend-difference">
//         Scene Name
//       </h1>

//       <div className="absolute inset-0 flex items-center justify-center w-full h-screen" style={{ perspective: "2500px", perspectiveOrigin: "50% 60%" }}>
        
//         {/* Dialogues */}
//         {[0, 1].map(i => (
//           <div 
//             key={i} 
//             ref={addDialogueRef} 
//             className="absolute text-white text-sm font-bold px-7 py-5 rounded-2xl pointer-events-none z-[100] -translate-x-1/2 select-none"
//             style={{ 
//               background: "rgba(0, 0, 0, 0.8)", 
//               backdropFilter: "blur(25px)", 
//               border: "1px solid rgba(255, 255, 255, 0.12)", 
//               maxWidth: "300px",
//               boxShadow: "0 30px 60px rgba(0,0,0,0.6)"
//             }}
//           />
//         ))}

//         <svg viewBox="0 0 1000 600" className="w-[85vw] h-[75vh] overflow-visible z-10">
//           <defs>
//             <clipPath id="pageClip">
//               <rect x="100" y="50" width="800" height="450" rx="18" />
//             </clipPath>
//           </defs>

//           {/* BACKGROUND */}
//           <image 
//             ref={bgRef} 
//             x="100" y="50" width="800" height="450" 
//             preserveAspectRatio="xMidYMid slice" 
//             clipPath="url(#pageClip)"
//             style={{ transformOrigin: "50% 500px", transition: "none" }}
//           />
          
//           {/* CHARACTER: Moves independently */}
//           <image 
//             ref={charRef} 
//             x="100" y="50" width="800" height="450" 
//             preserveAspectRatio="xMidYMid slice" 
//             style={{ transformOrigin: "50% 500px", transition: "none" }}
//           />
          
//           {/* HINGE BAR */}
//           <rect x="50" y="500" width="900" height="24" fill="#080808" rx="12" />
//           <rect x="50" y="500" width="900" height="2" fill="rgba(255,255,255,0.15)" />
//         </svg>

//         {/* Controls */}
//         <div className="absolute bottom-10 flex gap-5 z-[100]">
//           <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="p-4 rounded-full bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all"><FiRotateCcw size={20} /></button>
//           <button onClick={() => window.scrollBy({top: 5000, behavior: 'smooth'})} className="p-4 rounded-full bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all"><FiChevronDown size={20} /></button>
//         </div>
//       </div>
//     </div>
//   );
// }



// 🍏🍏🍏🍏🍏


// 🍏🍏🍏🍎🍎

// import React, { useRef, useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { FiRotateCcw, FiChevronDown } from "react-icons/fi";

// gsap.registerPlugin(ScrollTrigger);


// const scenes = [
//   {
//     name: "Forest",
//     bg: "/assets/ADV_Screens_HyperBite/bg-1.png",
//     chars: [
//       { src: "/assets/ADV_Screens_HyperBite/fg-1.png", rotation: -3 }
//     ],
//     dialogue: [
//       { text: "Uff...", top: "22%", left: "50%" },
//       { text: "", top: "32%", left: "50%" }
//     ],
//     fgColor: "#2f3640",
//     fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
//     light: "rgba(0,100,0,0.25)"
//   },
//   {
//     name: "Ocean",
//     bg: "/assets/ADV_Screens_HyperBite/bg-2.png",
//     chars: [
//       { src: "/assets/ADV_Screens_HyperBite/fg-2.png", rotation: 4 }
//     ],
//     dialogue: [
//       { text: "why so nervous?", top: "25%", left: "45%" },
//       { text: "I have Lot of work to finish and play with my friends", top: "35%", left: "75%" }
//     ],
//     fgColor: "#05c46b",
//     fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
//     light: "rgba(0,150,255,0.2)"
//   },
//   {
//     name: "Sunset",
//     bg: "/assets/ADV_Screens_HyperBite/bg-3.png",
//     chars: [
//       { src: "/assets/ADV_Screens_HyperBite/fg-3.png", rotation: 0 }
//     ],
//     dialogue: [
//       { text: "This is HyperBite papa raw honey, dry fruits and protein with zero added sugar", top: "18%", left: "20%" },
//       { text: "No snaks are not good for kids it contains sugars", top: "28%", left: "70%" }
//     ],
//     fgColor: "#575fcf",
//     fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
//     light: "rgba(255,100,0,0.3)"
//   },
//   {
//     name: "Deep Forest",
//     bg: "/assets/ADV_Screens_HyperBite/bg-4.png",
//     chars: [
//       { src: "/assets/ADV_Screens_HyperBite/fg-4.png", rotation: -4 }
//     ],
//     dialogue: [
//       { text: "Amazing its delicious", top: "30%", left: "55%" },
//       { text: "Yes! very nice texture", top: "20%", left: "75%" },
//       // { text: "Yes! very nice texture", top: "40%", left: "55%" }
//     ],
//     fgColor: "#1b262c",
//     fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
//     light: "rgba(40,60,40,0.3)"
//   },
//   {
//     name: "Tidal Waves",
//     bg: "/assets/ADV_Screens_HyperBite/bg-5.png",
//     chars: [
//       { src: "/assets/ADV_Screens_HyperBite/fg-5.png", rotation: 6 }
//     ],
//     dialogue: [
//       { text: "It's like a nutrient bomb", top: "28%", left: "70%" },
//       { text: "Easy to carry for school and travel", top: "38%", left: "40%" }
//     ],
//     fgColor: "#0f4c75",
//     fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
//     light: "rgba(0,200,255,0.15)"
//   },
//   {
//     name: "Twilight",
//     bg: "/assets/ADV_Screens_HyperBite/bg-6.png",
//     chars: [
//       { src: "/assets/ADV_Screens_HyperBite/fg-6.png", rotation: -2 }
//     ],
//     dialogue: [
//       { text: "Wow feel the taste", top: "35%", left: "70%" },
//       { text: "Exactly we all are enjoying", top: "25%", left: "50%" },
//       { text: "Mm-mm! quite good", top: "35%", left: "20%" }
//     ],
//     fgColor: "#321e43",
//     fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
//     light: "rgba(150,50,255,0.2)"
//   }
// ];

// export default function ProfessionalLaptopEngine() {
//   const container = useRef();
//   const bgRef = useRef();
//   const fgRef = useRef();
//   const lightingRef = useRef();
//   const charRefs = useRef([]);
//   const dialogueRefs = useRef([]);
//   const currentIdxRef = useRef(-1);
//   const stRef = useRef(null);

//   const figmaEase = "cubic-bezier(0.34, 1.56, 0.64, 1)";

//   const addCharRef = (el) => { if (el && !charRefs.current.includes(el)) charRefs.current.push(el); };
//   const addDialogueRef = (el) => { if (el && !dialogueRefs.current.includes(el)) dialogueRefs.current.push(el); };

//   const handleReset = () => {
//     if (stRef.current) {
//       window.scrollTo({ top: stRef.current.start, behavior: "smooth" });
//       const s0 = scenes[0];
//       currentIdxRef.current = 0;
//       bgRef.current.setAttribute("href", s0.bg);
//       charRefs.current[0].setAttribute("href", s0.chars[0].src);
//       bgRef.current.style.filter = "blur(0px)";
//       bgRef.current.style.transform = "rotateX(0deg)";
//       charRefs.current[0].style.opacity = 1;
//       charRefs.current[0].style.transform = "rotateX(0deg)";
//       dialogueRefs.current.forEach(d => { d.style.opacity = 0; d.textContent = ""; });
//     }
//   };

//   const handleSkip = () => {
//     if (stRef.current) {
//       const last = scenes[scenes.length - 1];
//       bgRef.current.setAttribute("href", last.bg);
//       charRefs.current[0].setAttribute("href", last.chars[0].src);
//       window.scrollTo({ top: stRef.current.end + 20, behavior: "smooth" });
//     }
//   };

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const s0 = scenes[0];
//       bgRef.current.setAttribute("href", s0.bg);
//       fgRef.current.setAttribute("href", s0.fgImage);
//       charRefs.current[0].setAttribute("href", s0.chars[0].src);
      
//       stRef.current = ScrollTrigger.create({
//         trigger: container.current,
//         start: "top top",
//         end: "+=12000",
//         pin: true,
//         scrub: 0.5,
//         onUpdate: (self) => {
//           const progress = self.progress;
//           const total = scenes.length;
//           const idx = Math.min(Math.floor(progress * total), total - 1);
//           const segment = (progress * total) % 1;

//           if (self.direction === -1 && progress > 0.05 && progress < 0.95) return; 

//           const bg = bgRef.current;
//           const light = lightingRef.current;

//           // 1. Initial Scene 1 Sharp
//           if (idx === 0 && segment < 0.12) {
//             bg.style.filter = "blur(0px)";
//             bg.style.transform = "rotateX(0deg)";
//             charRefs.current[0].style.opacity = 1;
//             charRefs.current[0].style.transform = "rotateX(0deg)";
//             dialogueRefs.current.forEach(d => { d.style.opacity = 0; d.textContent = ""; });
//             return;
//           }

//           // 2. Transition (Close & CONTENT SWAP)
//           if (segment >= 0.12 && segment < 0.45) {
//             bg.style.transition = `transform 0.6s ease-in-out`;
//             bg.style.transform = "rotateX(110deg)";
//             bg.style.filter = "blur(0px)";

//             charRefs.current.forEach(c => {
//               c.style.transition = `transform 0.6s ease-in-out, opacity 0.2s`;
//               c.style.transform = "rotateX(110deg)";
//               c.style.opacity = 0;
//             });

//             // CRITICAL: Clear dialogues the moment we move away from focus
//             dialogueRefs.current.forEach(d => {
//                d.style.opacity = 0;
//                d.style.transition = "none"; // Kill transitions to prevent flickering
//             });

//             if (segment > 0.3 && idx !== currentIdxRef.current) {
//               const s = scenes[idx];
//               bg.setAttribute("href", s.bg);
//               fgRef.current.setAttribute("href", s.fgImage);
//               fgRef.current.setAttribute("width", "900"); // Standard SVG width attribute
//               light.style.background = `radial-gradient(circle, ${s.light} 0%, transparent 80%)`;
//               // fgRef.current.style.width = "900px";
              
//               // Physically wipe text content here
//               dialogueRefs.current.forEach(d => d.textContent = "");

//               charRefs.current.forEach((c, i) => { 
//                 if(s.chars[i]) c.setAttribute("href", s.chars[i].src); 
//               });
//               currentIdxRef.current = idx;
//             }
//           }

//           // 3. Opening
//           else if (segment >= 0.45 && segment < 0.75) {
//             bg.style.transform = "rotateX(0deg)";
//             bg.style.transition = `transform 0.8s ${figmaEase}`;
            
//             charRefs.current.forEach(c => {
//               c.style.transition = `transform 0.8s ${figmaEase} 0.12s, opacity 0.3s`;
//               c.style.transform = "rotateX(0deg)";
//               c.style.opacity = 1;
//             });
//             // Keep dialogues empty/hidden during the flip
//             dialogueRefs.current.forEach(d => {
//                 d.style.opacity = 0;
//                 d.textContent = ""; 
//             });
//           }

//           // 4. Focus (Inject & Show Dialogue)
//           else if (segment >= 0.75) {
//             bg.style.filter = "blur(22px)";
//             bg.style.transition = "filter 0.6s ease-out";
            
//             const currentScene = scenes[idx];
//             dialogueRefs.current.forEach((d, i) => {
//               const diag = currentScene.dialogue[i];
//               if (diag && diag.text !== "") {
//                 // Inject text only now
//                 d.textContent = diag.text;
//                 d.style.top = diag.top;
//                 d.style.left = diag.left;
                
//                 // Fade in
//                 d.style.transition = `opacity 0.6s ease ${0.2 + (i * 0.15)}s`;
//                 d.style.opacity = 1;
//               }
//             });
//             light.style.opacity = 1;
//           }
//         }
//       });
//     }, container);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={container} className="bg-black w-full h-screen relative overflow-hidden">
//       <div className="absolute inset-0 flex items-center justify-center w-full h-screen" style={{ perspective: "2200px", perspectiveOrigin: "50% 65%" }}>
        
//         <div ref={lightingRef} className="absolute inset-0 pointer-events-none mix-blend-screen opacity-0 z-[5]" />

//         {[0, 1, 2].map(i => (
//           // <div key={i} ref={addDialogueRef} className="absolute text-white text-[13px] md:text-sm font-light tracking-wide px-5 py-3 rounded-xl pointer-events-none z-[60] opacity-0 -translate-x-1/2 select-none text-center"
//           //   style={{ 
//           //     background: "rgba(255, 255, 255, 0.03)", 
//           //     backdropFilter: "blur(24px)", 
//           //     border: "1px solid rgba(255, 255, 255, 0.1)", 
//           //     maxWidth: "240px",
//           //     willChange: "opacity"
//           //   }}
//           // />
//           <div 
//     key={i} 
//     ref={addDialogueRef} 
//     className="absolute text-white text-[13px] md:text-sm font-light tracking-wide px-5 py-3 rounded-xl pointer-events-none z-[60] opacity-0 -translate-x-1/2 select-none text-center"
//     style={{ 
//       // Deep Black Obsidian Theme
//       background: "rgba(0, 0, 0, 0.65)", 
//       backdropFilter: "blur(20px) saturate(180%)", 
//       border: "1px solid rgba(255, 255, 255, 0.08)", 
//       maxWidth: "260px",
//       boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
//       willChange: "opacity, transform",
//       color: "#FFFFFF" // Explicit pure white text
//     }}
//   />
//         ))}

//         {/* <svg viewBox="0 0 1000 500" className="w-[90vw] h-[80vh] overflow-visible z-10">
//           <image ref={bgRef} x="100" y="50" width="800" height="450" preserveAspectRatio="xMidYMid slice" style={{ transformOrigin: "bottom center" }} />
//           {[0].map(i => ( 
//             <image key={i} ref={addCharRef} x="100" y="50" width="800" height="450" style={{ transformOrigin: "bottom center", zIndex: 30 }} /> 
//           ))}
//           <image ref={fgRef} x="50" y="485" width="900" height="20" />
//         </svg> */}

//         <svg viewBox="0 0 1000 500" className="w-[90vw] h-[80vh] overflow-visible z-10">
//   {/* Background */}
//   <image ref={bgRef} x="100" y="50" width="800" height="450" preserveAspectRatio="xMidYMid slice" style={{ transformOrigin: "bottom center" }} />
  
//   {/* Characters */}
//   {[0].map(i => ( 
//     <image key={i} ref={addCharRef} x="100" y="50" width="800" height="450" style={{ transformOrigin: "bottom center", zIndex: 30 }} /> 
//   ))}
  
//   {/* Foreground - Set base attributes here */}
//   <image 
//     ref={fgRef} 
//     x="50" 
//     y="485" 
//     width="900" 
//     height="20" 
//     preserveAspectRatio="none" 
//   />
// </svg>

//         <div className="absolute bottom-10 flex gap-5 z-[100]">
//           <button onClick={handleReset} className="p-3.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"><FiRotateCcw size={20} /></button>
//           <button onClick={handleSkip} className="p-3.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"><FiChevronDown size={20} /></button>
//         </div>
//       </div>
//     </div>
//   );
// }



