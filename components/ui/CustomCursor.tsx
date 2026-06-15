"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Set initial position out of screen
    gsap.set(cursor, { x: -100, y: -100, xPercent: -50, yPercent: -50 });
    gsap.set(dot, { x: -100, y: -100, xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Move dot immediately
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    // Smooth animation loop for the outer circle
    const tick = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      gsap.set(cursor, {
        x: cursorX,
        y: cursorY
      });
      
      requestAnimationFrame(tick);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('magnetic-button')
      ) {
        setIsHovering(true);
        gsap.to(cursor, {
          scale: 1.5,
          backgroundColor: "rgba(0, 74, 173, 0.1)",
          borderColor: "rgba(0, 74, 173, 0.5)",
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.2
        });
      } else {
        setIsHovering(false);
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "rgba(33, 37, 41, 0.3)",
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.2
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
      />
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[10000] hidden md:block mix-blend-difference"
      />
    </>
  );
}
