"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 80],
    ["1px solid rgba(233, 236, 239, 0)", "1px solid rgba(233, 236, 239, 1)"]
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      style={{ background, borderBottom }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[24px] md:px-[64px] lg:px-[120px] py-[24px] backdrop-blur-md"
    >
      <div className="flex items-baseline gap-[16px]">
        <Link href="/" className="text-[24px] font-[800] text-bone-white tracking-[-0.02em]">
          VINme
        </Link>
        <span className="text-[13px] text-ash tracking-[0.1em] hidden md:inline-block uppercase font-[600]">We buy cars.</span>
      </div>

      <div className="hidden md:flex items-center gap-[48px]">
        <Link href="#about" className="text-[14px] font-[600] text-bone-white hover:text-signal-amber transition-colors uppercase tracking-[0.1em]">
          About Us
        </Link>
        <Link href="#dealers" className="text-[14px] font-[600] text-bone-white hover:text-signal-amber transition-colors uppercase tracking-[0.1em]">
          Dealers
        </Link>
        <Link href="#contact" className="text-[14px] font-[600] text-bone-white hover:text-signal-amber transition-colors uppercase tracking-[0.1em]">
          Contact
        </Link>
        <a href="#hero" className="magnetic-button btn-editorial !py-[12px] !px-[32px] !text-[14px]">
          Get an Offer
        </a>
      </div>

      <div className="md:hidden">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-bone-white">
          {mobileMenuOpen ? <X size={32} strokeWidth={1} /> : <Menu size={32} strokeWidth={1} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-void-black border-b border-soot p-[24px] flex flex-col gap-[32px] md:hidden">
          <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="text-[24px] font-[400] text-bone-white tracking-tight">About Us</Link>
          <Link href="#dealers" onClick={() => setMobileMenuOpen(false)} className="text-[24px] font-[400] text-bone-white tracking-tight">Dealers</Link>
          <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[24px] font-[400] text-bone-white tracking-tight">Contact Us</Link>
          <button className="magnetic-button btn-editorial w-full mt-[16px]">
            Get an Offer
          </button>
        </div>
      )}
    </motion.nav>
  );
}
