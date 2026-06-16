"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
}

export default function TextReveal({ text, className = "" }: TextRevealProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 80%", "end 50%"]
  });

  const words = text.split(" ");

  return (
    <div ref={targetRef} className={`relative z-10 py-16 md:py-24 ${className}`}>
      <div className="container-editorial flex justify-center text-left">
        <p className="text-[22px] sm:text-[30px] md:text-[38px] lg:text-[46px] font-[700] tracking-tight leading-normal text-ash/20 max-w-[1000px] flex flex-wrap select-none">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            
            const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1]);
            
            return (
              <span key={i} className="relative mr-3 mb-2 md:mr-4 md:mb-3">
                <span className="absolute opacity-10 text-ash">
                  {word}
                </span>
                <motion.span style={{ opacity }} className="text-bone-white">
                  {word}
                </motion.span>
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
