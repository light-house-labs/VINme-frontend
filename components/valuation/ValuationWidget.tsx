"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { MoveRight } from "lucide-react";

export default function ValuationWidget() {
  const [activeTab, setActiveTab] = useState<"plate" | "vin" | "make">("plate");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Magnetic button effect
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(button, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full p-8 lg:p-12 flex flex-col z-10 bg-void-black border border-soot transition-all duration-500 ease-in-out`}
    >
      
      {/* Technical Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-signal-amber transition-all duration-300" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-signal-amber transition-all duration-300" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-signal-amber transition-all duration-300" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-signal-amber transition-all duration-300" />

      <div className="flex border-b border-soot mb-12 relative">
        {(["plate", "vin", "make"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-6 text-[13px] font-[600] uppercase tracking-[0.1em] transition-colors relative rounded-none ${
              activeTab === tab ? "text-bone-white" : "text-ash hover:text-bone-white"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-signal-amber z-20"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {tab === "plate" ? "License Plate" : tab === "vin" ? "VIN" : "Make+Model"}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-[140px] flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "plate" && (
            <motion.div 
              key="plate"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="flex gap-6 group">
                <div className="flex-[2] relative">
                  <input
                    type="text"
                    placeholder="ENTER PLATE"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[18px] placeholder:text-ash/30 transition-colors uppercase tracking-[0.2em] rounded-none focus:border-transparent peer"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                </div>
                <div className="flex-1 relative">
                  <select 
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[18px] transition-colors uppercase tracking-[0.2em] appearance-none rounded-none cursor-pointer focus:border-transparent peer"
                  >
                    <option value="CA">CA</option>
                    <option value="NY">NY</option>
                    <option value="TX">TX</option>
                  </select>
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "vin" && (
            <motion.div 
              key="vin"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="ENTER 17-DIGIT VIN"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[18px] placeholder:text-ash/30 transition-colors uppercase tracking-[0.2em] rounded-none focus:border-transparent peer"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
              </div>
            </motion.div>
          )}

          {activeTab === "make" && (
            <motion.div 
              key="make"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <select 
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[18px] transition-colors uppercase tracking-[0.2em] appearance-none rounded-none cursor-pointer focus:border-transparent peer"
                  >
                    <option value="">YEAR</option>
                    <option value="2023">2023</option>
                  </select>
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                </div>
                <div className="relative">
                  <select 
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[18px] transition-colors uppercase tracking-[0.2em] appearance-none rounded-none cursor-pointer focus:border-transparent peer"
                  >
                    <option value="">MAKE</option>
                    <option value="toyota">Toyota</option>
                  </select>
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                </div>
              </div>
              <div className="relative">
                <select 
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[18px] transition-colors uppercase tracking-[0.2em] appearance-none rounded-none cursor-pointer focus:border-transparent peer"
                >
                  <option value="">MODEL</option>
                </select>
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-16 flex justify-end">
        <button 
          ref={buttonRef}
          className="btn-editorial w-full mt-4 !px-8 !py-6 flex items-center justify-between"
        >
          <span className="relative z-10">Get Real Offer</span>
          <MoveRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
