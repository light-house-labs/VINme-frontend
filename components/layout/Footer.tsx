import Link from "next/link";
import { CursorDrivenParticleTypography } from "@/components/ui/CursorDrivenParticleTypography";

export default function Footer() {
  return (
    <footer className="bg-void-black border-t border-soot pt-[80px] pb-[48px] px-[24px] md:px-[64px] lg:px-[120px]">
      <div className="container-editorial grid grid-cols-1 md:grid-cols-12 gap-[48px] lg:gap-[80px] mb-[24px] lg:mb-[32px] text-left">
        {/* Brand block */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-start">
          <div className="flex items-baseline gap-[12px] mb-[12px]">
            <Link href="/" className="text-[28px] md:text-[32px] font-[800] text-bone-white tracking-[-0.02em]">
              VINme
            </Link>
            <span className="text-[13px] text-ash tracking-[0.1em] uppercase font-[600]">We buy cars.</span>
          </div>
          <span className="text-[14px] text-ash mt-[4px] leading-relaxed max-w-[280px]">
            AI-driven instant vehicle appraisal and direct purchasing. Fair offers. Direct payouts.
          </span>
          {/* Socials */}
          <div className="flex gap-[20px] mt-[32px]">
            <a href="#" className="text-ash hover:text-signal-amber transition-colors" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="text-ash hover:text-signal-amber transition-colors" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="text-ash hover:text-signal-amber transition-colors" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
        
        {/* Links Col 1 */}
        <div className="col-span-6 md:col-span-4 lg:col-span-2.5 flex flex-col gap-[16px]">
          <span className="text-[11px] font-mono font-[700] text-bone-white tracking-[0.2em] uppercase">Solutions</span>
          <div className="flex flex-col gap-[12px]">
            <Link href="/" className="text-[13px] text-ash hover:text-bone-white transition-colors">Instant Appraisal</Link>
            <Link href="#dealers" className="text-[13px] text-ash hover:text-bone-white transition-colors">Dealer Solutions</Link>
            <Link href="#about" className="text-[13px] text-ash hover:text-bone-white transition-colors">Enterprise Partnering</Link>
            <Link href="/" className="text-[13px] text-ash hover:text-bone-white transition-colors">Fleet Liquidation</Link>
          </div>
        </div>

        {/* Links Col 2 */}
        <div className="col-span-6 md:col-span-4 lg:col-span-2.5 flex flex-col gap-[16px]">
          <span className="text-[11px] font-mono font-[700] text-bone-white tracking-[0.2em] uppercase">Company</span>
          <div className="flex flex-col gap-[12px]">
            <Link href="#about" className="text-[13px] text-ash hover:text-bone-white transition-colors">About Our AI</Link>
            <Link href="#about" className="text-[13px] text-ash hover:text-bone-white transition-colors">Our Process</Link>
            <Link href="#contact" className="text-[13px] text-ash hover:text-bone-white transition-colors">Support Center</Link>
            <Link href="#contact" className="text-[13px] text-ash hover:text-bone-white transition-colors">Careers</Link>
          </div>
        </div>

        {/* Links Col 3 */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col gap-[16px]">
          <span className="text-[11px] font-mono font-[700] text-bone-white tracking-[0.2em] uppercase">Legal</span>
          <div className="flex flex-col gap-[12px]">
            <a href="#" className="text-[13px] text-ash hover:text-bone-white transition-colors">Privacy Charter</a>
            <a href="#" className="text-[13px] text-ash hover:text-bone-white transition-colors">Terms of Transaction</a>
            <a href="#" className="text-[13px] text-ash hover:text-bone-white transition-colors">Valuation Disclosures</a>
            <a href="#" className="text-[13px] text-ash hover:text-bone-white transition-colors">State Licensing</a>
          </div>
        </div>

        {/* Large Particle Typography Brand Logo */}
        <div className="col-span-12 lg:col-span-9 flex justify-center lg:justify-end items-center h-full">
          <div className="w-full max-w-[750px] h-[100px] md:h-[130px] lg:h-[160px] select-none pointer-events-auto">
            <CursorDrivenParticleTypography 
              text="VINme" 
              fontSize={240} 
              particleDensity={7.0} 
              particleSize={2.2} 
              dispersionStrength={12}
              color="rgba(0, 74, 173, 0.18)"
              className="!min-h-0 h-full w-full"
            />
          </div>
        </div>
      </div>

      <div className="container-editorial flex flex-col md:flex-row justify-between items-center pt-[32px] border-t border-soot gap-4">
        <span className="text-[11px] text-ash tracking-[0.1em] uppercase font-[600]">© 2026 VINme. All rights reserved.</span>
        <span className="text-[11px] text-ash tracking-[0.1em] uppercase font-[600]">Designed with precision.</span>
      </div>
    </footer>
  );
}
