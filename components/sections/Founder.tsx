"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const proofImages = [
    { src: "/images/proof1.jpg", alt: "Ori Filhart with customer" },
    { src: "/images/proof2.jpg", alt: "Happy client receiving vehicle key" },
    { src: "/images/proof3.jpg", alt: "Ori Filhart finalizing car handover" },
    { src: "/images/proof4.jpg", alt: "Ori Filhart delivering premium sedan" },
    { src: "/images/proof6.jpg", alt: "Owner posing with new sports car" },
    { src: "/images/proof7.jpg", alt: "VINme founder delivering vehicle keys" },
    { src: "/images/proof8.jpg", alt: "Ori Filhart congratulating new car owner" },
  ];

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !imageRef.current) return;

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
            start: "top 70%",
          }
        }
      );
    }

    gsap.fromTo(textRef.current.querySelectorAll('.reveal-element'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    gsap.fromTo(imageRef.current,
      { scale: 1.1, y: -20 },
      {
        scale: 1,
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const isMobile = window.innerWidth < 640;
      const scrollAmount = isMobile ? 304 : 384; // slide width + gap (280+24 or 360+24)
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const isMobile = window.innerWidth < 640;
      const slideWidth = isMobile ? 304 : 384;
      const index = Math.round(scrollLeft / slideWidth);
      setActiveIndex(Math.max(0, Math.min(index, proofImages.length - 1)));
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="section-editorial border-t border-soot overflow-hidden !pb-0"
    >
      {/* 1. Founder Biography Section */}
      <div className="container-editorial grid-12 mb-[80px] lg:mb-[120px]">
        {/* Text Column */}
        <div ref={textRef} className="col-span-4 md:col-span-8 lg:col-span-7 flex flex-col justify-center text-left pt-[32px] lg:pt-[80px]">
          <div className="label-editorial reveal-element">
            ABOUT US
          </div>
          <h2 className="heading-editorial">
            Lifelong automotive enthusiast and buyer.
          </h2>
          <p className="paragraph-editorial reveal-element">
            For over a decade, we've built VINme on the principle of transparency. We believe selling a car shouldn't be a battle of attrition or a game of hidden fees. Our AI-powered valuation ensures you get a fair, data-backed offer in minutes, while our dedicated team handles the rest.
          </p>
          
          <div className="mb-[48px] reveal-element">
            <span className="font-['Brush_Script_MT',cursive] text-[48px] text-bone-white opacity-85 italic">
              Ori Filhart
            </span>
          </div>

          <Link href="#contact" className="inline-block group reveal-element">
            <div className="inline-flex items-center gap-[12px] text-[16px] font-[600] text-signal-amber transition-colors uppercase tracking-[0.1em]">
              Get In Touch 
              <div className="transition-transform duration-300 ease-out group-hover:translate-x-2">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        </div>

        {/* Image Column */}
        <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9 w-full min-h-[400px] lg:min-h-[520px] relative mt-[64px] lg:mt-0 overflow-hidden border border-soot bg-carbon">
          <Image
            ref={imageRef}
            src="/images/founder.png"
            alt="Ori Filhart, Founder of VINme"
            fill
            className="object-cover object-[center_top] rounded-none animate-fade-in"
            priority
          />
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-soot/40" />

      {/* 2. Video Testimonials Section */}
      <div className="bg-carbon/20 py-[80px] lg:py-[120px]">
        <div className="container-editorial">
          <div className="max-w-[800px] text-left mb-[48px]">
            <div className="label-editorial">CLIENT TESTIMONIALS</div>
            <h3 className="heading-editorial !mb-4">Stories of Trust</h3>
            <p className="paragraph-editorial !mb-0">
              Hear directly from our clients about their experience selling their luxury, classic, and exotic vehicles to VINme.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px]">
            {/* Video 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative aspect-video w-full overflow-hidden border border-soot bg-void-black shadow-lg"
            >
              <iframe
                src="https://player.vimeo.com/video/494055057"
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>

            {/* Video 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative aspect-video w-full overflow-hidden border border-soot bg-void-black shadow-lg"
            >
              <iframe
                src="https://player.vimeo.com/video/494883544"
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-soot/40" />

      {/* 3. Customer Handover Carousel Section */}
      <div className="py-[80px] lg:py-[120px] bg-void-black">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-[48px] gap-6 text-left">
            <div className="max-w-[700px]">
              <div className="label-editorial">PROOF OF TRUST</div>
              <h3 className="heading-editorial !mb-4">Recent Customer Deliveries</h3>
              <p className="paragraph-editorial !mb-0">
                Real handovers, real offers, and real happy owners. See our founder Ori Filhart executing transactions across the country.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => scroll('left')}
                className="w-[52px] h-[52px] border border-soot hover:border-signal-amber hover:text-signal-amber flex items-center justify-center transition-colors rounded-none cursor-pointer text-bone-white bg-void-black"
                aria-label="Previous deliveries"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-[52px] h-[52px] border border-soot hover:border-signal-amber hover:text-signal-amber flex items-center justify-center transition-colors rounded-none cursor-pointer text-bone-white bg-void-black"
                aria-label="Next deliveries"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Row (Full bleed padding-left matching container-editorial) */}
        <div className="relative pl-[24px] md:pl-[48px] lg:pl-[64px] xl:pl-[calc((100vw-1440px)/2+64px)] overflow-hidden">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-[24px] overflow-x-auto scrollbar-none snap-x snap-mandatory pr-[64px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {proofImages.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="w-[280px] sm:w-[360px] shrink-0 snap-start group"
              >
                <div className="relative h-[380px] sm:h-[480px] w-full overflow-hidden border border-soot/80 bg-carbon">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 280px, 360px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-end p-6" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="container-editorial mt-[32px] flex justify-start gap-[8px]">
          {proofImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (carouselRef.current) {
                  const isMobile = window.innerWidth < 640;
                  const slideWidth = isMobile ? 304 : 384;
                  carouselRef.current.scrollTo({
                    left: idx * slideWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`h-[2px] transition-all duration-300 rounded-none cursor-pointer ${
                activeIndex === idx ? 'w-[40px] bg-signal-amber' : 'w-[12px] bg-soot/40 hover:bg-soot'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
