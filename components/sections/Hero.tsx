"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import SplitType from "split-type";
import ValuationWidget from "@/components/valuation/ValuationWidget";
import { useParticles } from "@/hooks/useParticles";

export default function Hero() {
  const canvasRef = useParticles();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;

    const split = new SplitType(headlineRef.current, { types: 'lines,words,chars' });
    
    const tl = gsap.timeline();
    
    tl.fromTo(
      split.chars,
      { opacity: 0, y: 50, rotateX: -90 },
      { 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        stagger: 0.02, 
        duration: 1.2, 
        ease: "power4.out",
        delay: 0.5
      }
    );

    // Parallax background
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        y: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    return () => {
      split.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100vh] lg:min-h-[110vh] flex items-center pt-120 pb-80 overflow-hidden bg-void-black mb-160 lg:mb-200 clip-path-hero">
      {/* Background Image & Overlay */}
      <div ref={bgRef} className="absolute inset-0 z-0 h-[120%] -top-[10%]">
        <Image
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"
          alt="White sports car"
          fill
          className="object-cover opacity-[0.4] grayscale-[50%] rounded-none"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black via-transparent to-transparent" />
      </div>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="container-editorial w-full relative z-10 grid-12 items-center">
        <div className="col-span-4 md:col-span-8 lg:col-span-7 flex flex-col justify-center pt-32 lg:pt-0">
          <div className="label-editorial opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            AI-Powered Valuation
          </div>

          <h1 ref={headlineRef} className="text-[56px] md:text-[72px] lg:text-[110px] font-[800] text-bone-white leading-[0.9] tracking-[-0.05em] whitespace-pre-line text-left mb-16 lg:mb-32 uppercase" style={{ perspective: '1000px' }}>
            SELL YOUR CAR.<br/>GET A REAL OFFER.
          </h1>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9 flex justify-end items-center mt-16 lg:mt-0">
          <ValuationWidget />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
        <div className="w-[1px] h-64 bg-gradient-to-b from-ash to-transparent animate-scroll-line" />
        <span className="text-[10px] text-ash tracking-[0.2em] uppercase mt-16 opacity-50">SCROLL</span>
      </div>
    </section>
  );
}
