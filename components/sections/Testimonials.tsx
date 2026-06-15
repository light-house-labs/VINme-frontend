"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    { 
      id: 1,
      name: "Michael R.",
      car: "2022 Porsche 911 GT3",
      quote: "The easiest transaction I've ever experienced. No games, just a solid offer and a seamless pickup.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      id: 2,
      name: "Sarah L.",
      car: "2021 Land Rover Defender",
      quote: "VINme offered me $4,000 more than the dealer tradeoff. The concierge service was truly white-glove.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
    },
  ];

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !containerRef.current) return;

    const heading = textRef.current.querySelector('h2');
    if (heading) {
      const split = new SplitType(heading, { types: 'lines,words' });
      gsap.fromTo(split.words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }

    gsap.fromTo(textRef.current.querySelector('.label-editorial'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      }
    );

    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%"
        }
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="section-editorial"
    >
      <div className="container-editorial text-left">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[120px] gap-[64px]">
          <div ref={textRef}>
            <div className="label-editorial">
              WHAT SELLERS SAY
            </div>
            <h2 className="heading-editorial mb-0 max-w-[600px]">
              Real people.{"\n"}Real offers.
            </h2>
          </div>
          
          <div className="flex items-center gap-[32px]">
            <button onClick={prevSlide} className="magnetic-button text-ash hover:text-bone-white transition-colors p-[12px] opacity-70 hover:opacity-100">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="flex gap-[16px]">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-[60px] h-[2px] transition-all duration-500 rounded-none ${
                    activeIndex === i ? "bg-signal-amber" : "bg-soot"
                  }`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="magnetic-button text-ash hover:text-bone-white transition-colors p-[12px] opacity-70 hover:opacity-100">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        <div ref={containerRef} className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-carbon overflow-hidden group rounded-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
            >
              <div className="absolute inset-0 z-0">
                <Image
                   src={testimonials[activeIndex].image}
                   alt={testimonials[activeIndex].name}
                   fill
                   className="object-cover opacity-30 grayscale-[80%]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-void-black to-transparent" />
              </div>
              
              <div className="relative z-10 p-[40px] md:p-[80px] flex flex-col justify-end h-full max-w-[800px]">
                <p className="text-[24px] md:text-[36px] font-[400] text-bone-white leading-[1.4] mb-[40px] tracking-tight">
                  "{testimonials[activeIndex].quote}"
                </p>
                <div>
                  <div className="text-[18px] font-[700] text-bone-white tracking-widest uppercase mb-[8px]">{testimonials[activeIndex].name}</div>
                  <div className="text-[14px] text-signal-amber tracking-widest uppercase font-[600]">{testimonials[activeIndex].car}</div>
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-[100px] h-[100px] rounded-full border border-bone-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-signal-amber group-hover:border-signal-amber transition-colors duration-500">
                  <svg className="ml-2 w-[24px] h-[24px] text-bone-white group-hover:text-void-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
