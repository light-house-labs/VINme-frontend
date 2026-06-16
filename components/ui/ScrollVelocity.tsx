"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function VelocityText({ children, baseVelocity = 100 }: VelocityTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * velocityFactor.get() * moveBy;

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden tracking-[-0.02em] leading-[0.8] whitespace-nowrap flex flex-nowrap w-full">
      <motion.div className="text-[32px] md:text-[56px] lg:text-[72px] font-[800] uppercase tracking-tighter flex whitespace-nowrap gap-8 md:gap-12 flex-nowrap text-bone-white/80" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity() {
  return (
    <div className="relative w-full overflow-hidden py-12 md:py-20 bg-void-black border-y border-soot flex flex-col gap-4 md:gap-6 select-none my-8 md:my-16">
      {/* Subtle background glow to add contrast */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[100px] bg-signal-amber/5 blur-[120px] rounded-full pointer-events-none" />
      
      <VelocityText baseVelocity={-1.5}>
        <span className="text-bone-white">VINme Appraisals</span> • <span className="text-signal-amber">Instant Payment</span> • <span className="text-bone-white">Secure</span> • <span className="text-signal-amber">Fast Payouts</span> • Concierge Service •
      </VelocityText>
      <VelocityText baseVelocity={1.5}>
        <span className="text-bone-white">Sell From Home</span> • <span className="text-signal-amber">No Dealership Trips</span> • <span className="text-bone-white">No Hassle</span> • <span className="text-signal-amber">Data-Backed</span> • Fair Offers •
      </VelocityText>
    </div>
  );
}
