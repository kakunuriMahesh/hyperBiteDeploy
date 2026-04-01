import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiRotateCcw, FiChevronDown } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);


const scenes = [
  {
    name: "Forest",
    bg: "/assets/ADV_Screens_HyperBite/bg-1.png",
    chars: [
      { src: "/assets/ADV_Screens_HyperBite/fg-1.png", rotation: -3 }
    ],
    dialogue: [
      { text: "Uff...", top: "22%", left: "50%" },
      { text: "", top: "32%", left: "50%" }
    ],
    fgColor: "#2f3640",
    fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
    light: "rgba(0,100,0,0.25)"
  },
  {
    name: "Ocean",
    bg: "/assets/ADV_Screens_HyperBite/bg-2.png",
    chars: [
      { src: "/assets/ADV_Screens_HyperBite/fg-2.png", rotation: 4 }
    ],
    dialogue: [
      { text: "why so nervous?", top: "25%", left: "45%" },
      { text: "I have Lot of work to finish and play with my friends", top: "35%", left: "75%" }
    ],
    fgColor: "#05c46b",
    fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
    light: "rgba(0,150,255,0.2)"
  },
  {
    name: "Sunset",
    bg: "/assets/ADV_Screens_HyperBite/bg-3.png",
    chars: [
      { src: "/assets/ADV_Screens_HyperBite/fg-3.png", rotation: 0 }
    ],
    dialogue: [
      { text: "This is HyperBite papa raw honey, dry fruits and protein with zero added sugar", top: "18%", left: "20%" },
      { text: "No snaks are not good for kids it contains sugars", top: "28%", left: "70%" }
    ],
    fgColor: "#575fcf",
    fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
    light: "rgba(255,100,0,0.3)"
  },
  {
    name: "Deep Forest",
    bg: "/assets/ADV_Screens_HyperBite/bg-4.png",
    chars: [
      { src: "/assets/ADV_Screens_HyperBite/fg-4.png", rotation: -4 }
    ],
    dialogue: [
      { text: "Amazing its delicious", top: "30%", left: "55%" },
      { text: "Yes! very nice texture", top: "20%", left: "75%" },
      // { text: "Yes! very nice texture", top: "40%", left: "55%" }
    ],
    fgColor: "#1b262c",
    fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
    light: "rgba(40,60,40,0.3)"
  },
  {
    name: "Tidal Waves",
    bg: "/assets/ADV_Screens_HyperBite/bg-5.png",
    chars: [
      { src: "/assets/ADV_Screens_HyperBite/fg-5.png", rotation: 6 }
    ],
    dialogue: [
      { text: "It's like a nutrient bomb", top: "28%", left: "70%" },
      { text: "Easy to carry for school and travel", top: "38%", left: "40%" }
    ],
    fgColor: "#0f4c75",
    fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
    light: "rgba(0,200,255,0.15)"
  },
  {
    name: "Twilight",
    bg: "/assets/ADV_Screens_HyperBite/bg-6.png",
    chars: [
      { src: "/assets/ADV_Screens_HyperBite/fg-6.png", rotation: -2 }
    ],
    dialogue: [
      { text: "Wow feel the taste", top: "35%", left: "70%" },
      { text: "Exactly we all are enjoying", top: "25%", left: "50%" },
      { text: "Mm-mm! quite good", top: "35%", left: "20%" }
    ],
    fgColor: "#321e43",
    fgImage: "/assets/ADV_Screens_HyperBite/main-fg.png",
    light: "rgba(150,50,255,0.2)"
  }
];

export default function ProfessionalLaptopEngine() {
  const container = useRef();
  const bgRef = useRef();
  const fgRef = useRef();
  const lightingRef = useRef();
  const charRefs = useRef([]);
  const dialogueRefs = useRef([]);
  const currentIdxRef = useRef(-1);
  const stRef = useRef(null);

  const figmaEase = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  const addCharRef = (el) => { if (el && !charRefs.current.includes(el)) charRefs.current.push(el); };
  const addDialogueRef = (el) => { if (el && !dialogueRefs.current.includes(el)) dialogueRefs.current.push(el); };

  const handleReset = () => {
    if (stRef.current) {
      window.scrollTo({ top: stRef.current.start, behavior: "smooth" });
      const s0 = scenes[0];
      currentIdxRef.current = 0;
      bgRef.current.setAttribute("href", s0.bg);
      charRefs.current[0].setAttribute("href", s0.chars[0].src);
      bgRef.current.style.filter = "blur(0px)";
      bgRef.current.style.transform = "rotateX(0deg)";
      charRefs.current[0].style.opacity = 1;
      charRefs.current[0].style.transform = "rotateX(0deg)";
      dialogueRefs.current.forEach(d => { d.style.opacity = 0; d.textContent = ""; });
    }
  };

  const handleSkip = () => {
    if (stRef.current) {
      const last = scenes[scenes.length - 1];
      bgRef.current.setAttribute("href", last.bg);
      charRefs.current[0].setAttribute("href", last.chars[0].src);
      window.scrollTo({ top: stRef.current.end + 20, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const s0 = scenes[0];
      bgRef.current.setAttribute("href", s0.bg);
      fgRef.current.setAttribute("href", s0.fgImage);
      charRefs.current[0].setAttribute("href", s0.chars[0].src);
      
      stRef.current = ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=12000",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const total = scenes.length;
          const idx = Math.min(Math.floor(progress * total), total - 1);
          const segment = (progress * total) % 1;

          if (self.direction === -1 && progress > 0.05 && progress < 0.95) return; 

          const bg = bgRef.current;
          const light = lightingRef.current;

          // 1. Initial Scene 1 Sharp
          if (idx === 0 && segment < 0.12) {
            bg.style.filter = "blur(0px)";
            bg.style.transform = "rotateX(0deg)";
            charRefs.current[0].style.opacity = 1;
            charRefs.current[0].style.transform = "rotateX(0deg)";
            dialogueRefs.current.forEach(d => { d.style.opacity = 0; d.textContent = ""; });
            return;
          }

          // 2. Transition (Close & CONTENT SWAP)
          if (segment >= 0.12 && segment < 0.45) {
            bg.style.transition = `transform 0.6s ease-in-out`;
            bg.style.transform = "rotateX(110deg)";
            bg.style.filter = "blur(0px)";

            charRefs.current.forEach(c => {
              c.style.transition = `transform 0.6s ease-in-out, opacity 0.2s`;
              c.style.transform = "rotateX(110deg)";
              c.style.opacity = 0;
            });

            // CRITICAL: Clear dialogues the moment we move away from focus
            dialogueRefs.current.forEach(d => {
               d.style.opacity = 0;
               d.style.transition = "none"; // Kill transitions to prevent flickering
            });

            if (segment > 0.3 && idx !== currentIdxRef.current) {
              const s = scenes[idx];
              bg.setAttribute("href", s.bg);
              fgRef.current.setAttribute("href", s.fgImage);
              fgRef.current.setAttribute("width", "900"); // Standard SVG width attribute
              light.style.background = `radial-gradient(circle, ${s.light} 0%, transparent 80%)`;
              // fgRef.current.style.width = "900px";
              
              // Physically wipe text content here
              dialogueRefs.current.forEach(d => d.textContent = "");

              charRefs.current.forEach((c, i) => { 
                if(s.chars[i]) c.setAttribute("href", s.chars[i].src); 
              });
              currentIdxRef.current = idx;
            }
          }

          // 3. Opening
          else if (segment >= 0.45 && segment < 0.75) {
            bg.style.transform = "rotateX(0deg)";
            bg.style.transition = `transform 0.8s ${figmaEase}`;
            
            charRefs.current.forEach(c => {
              c.style.transition = `transform 0.8s ${figmaEase} 0.12s, opacity 0.3s`;
              c.style.transform = "rotateX(0deg)";
              c.style.opacity = 1;
            });
            // Keep dialogues empty/hidden during the flip
            dialogueRefs.current.forEach(d => {
                d.style.opacity = 0;
                d.textContent = ""; 
            });
          }

          // 4. Focus (Inject & Show Dialogue)
          else if (segment >= 0.75) {
            bg.style.filter = "blur(22px)";
            bg.style.transition = "filter 0.6s ease-out";
            
            const currentScene = scenes[idx];
            dialogueRefs.current.forEach((d, i) => {
              const diag = currentScene.dialogue[i];
              if (diag && diag.text !== "") {
                // Inject text only now
                d.textContent = diag.text;
                d.style.top = diag.top;
                d.style.left = diag.left;
                
                // Fade in
                d.style.transition = `opacity 0.6s ease ${0.2 + (i * 0.15)}s`;
                d.style.opacity = 1;
              }
            });
            light.style.opacity = 1;
          }
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="bg-black w-full h-screen relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center w-full h-screen" style={{ perspective: "2200px", perspectiveOrigin: "50% 65%" }}>
        
        <div ref={lightingRef} className="absolute inset-0 pointer-events-none mix-blend-screen opacity-0 z-[5]" />

        {[0, 1, 2].map(i => (
          // <div key={i} ref={addDialogueRef} className="absolute text-white text-[13px] md:text-sm font-light tracking-wide px-5 py-3 rounded-xl pointer-events-none z-[60] opacity-0 -translate-x-1/2 select-none text-center"
          //   style={{ 
          //     background: "rgba(255, 255, 255, 0.03)", 
          //     backdropFilter: "blur(24px)", 
          //     border: "1px solid rgba(255, 255, 255, 0.1)", 
          //     maxWidth: "240px",
          //     willChange: "opacity"
          //   }}
          // />
          <div 
    key={i} 
    ref={addDialogueRef} 
    className="absolute text-white text-[13px] md:text-sm font-light tracking-wide px-5 py-3 rounded-xl pointer-events-none z-[60] opacity-0 -translate-x-1/2 select-none text-center"
    style={{ 
      // Deep Black Obsidian Theme
      background: "rgba(0, 0, 0, 0.65)", 
      backdropFilter: "blur(20px) saturate(180%)", 
      border: "1px solid rgba(255, 255, 255, 0.08)", 
      maxWidth: "260px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
      willChange: "opacity, transform",
      color: "#FFFFFF" // Explicit pure white text
    }}
  />
        ))}

        {/* <svg viewBox="0 0 1000 500" className="w-[90vw] h-[80vh] overflow-visible z-10">
          <image ref={bgRef} x="100" y="50" width="800" height="450" preserveAspectRatio="xMidYMid slice" style={{ transformOrigin: "bottom center" }} />
          {[0].map(i => ( 
            <image key={i} ref={addCharRef} x="100" y="50" width="800" height="450" style={{ transformOrigin: "bottom center", zIndex: 30 }} /> 
          ))}
          <image ref={fgRef} x="50" y="485" width="900" height="20" />
        </svg> */}

        <svg viewBox="0 0 1000 500" className="w-[90vw] h-[80vh] overflow-visible z-10">
  {/* Background */}
  <image ref={bgRef} x="100" y="50" width="800" height="450" preserveAspectRatio="xMidYMid slice" style={{ transformOrigin: "bottom center" }} />
  
  {/* Characters */}
  {[0].map(i => ( 
    <image key={i} ref={addCharRef} x="100" y="50" width="800" height="450" style={{ transformOrigin: "bottom center", zIndex: 30 }} /> 
  ))}
  
  {/* Foreground - Set base attributes here */}
  <image 
    ref={fgRef} 
    x="50" 
    y="485" 
    width="900" 
    height="20" 
    preserveAspectRatio="none" 
  />
</svg>

        <div className="absolute bottom-10 flex gap-5 z-[100]">
          <button onClick={handleReset} className="p-3.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"><FiRotateCcw size={20} /></button>
          <button onClick={handleSkip} className="p-3.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"><FiChevronDown size={20} /></button>
        </div>
      </div>
    </div>
  );
}



