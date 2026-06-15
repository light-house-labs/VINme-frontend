import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-void-black border-t border-soot pt-[120px] pb-[64px] px-[24px] md:px-[64px] lg:px-[120px]">
      <div className="container-editorial flex flex-col lg:flex-row justify-between gap-[80px] mb-[120px]">
        <div className="flex flex-col text-left">
          <span className="text-[32px] font-[800] text-bone-white tracking-[-0.02em]">VINme</span>
          <span className="text-[18px] text-ash mt-[8px]">We buy cars.</span>
        </div>
        
        <div className="flex flex-wrap gap-[48px]">
          <Link href="/" className="text-[14px] font-[600] text-ash hover:text-bone-white transition-colors uppercase tracking-[0.1em]">Home</Link>
          <Link href="#about" className="text-[14px] font-[600] text-ash hover:text-bone-white transition-colors uppercase tracking-[0.1em]">About Us</Link>
          <Link href="#dealers" className="text-[14px] font-[600] text-ash hover:text-bone-white transition-colors uppercase tracking-[0.1em]">Dealers</Link>
          <Link href="#contact" className="text-[14px] font-[600] text-ash hover:text-bone-white transition-colors uppercase tracking-[0.1em]">Contact</Link>
        </div>

        <div className="flex gap-[32px]">
          <a href="#" className="text-ash hover:text-bone-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" className="text-ash hover:text-bone-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" className="text-ash hover:text-bone-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>
      </div>

      <div className="container-editorial flex flex-col md:flex-row justify-between items-center pt-[40px] border-t border-soot">
        <span className="text-[12px] text-ash tracking-[0.1em] uppercase font-[600]">© 2026 VINme</span>
        <span className="text-[12px] text-ash mt-[16px] md:mt-0 tracking-[0.1em] uppercase font-[600]">vinme.com</span>
      </div>
    </footer>
  );
}
