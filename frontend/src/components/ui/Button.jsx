import { cn } from "../../lib/utils.js"; 

export default function Button({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-xl font-black uppercase tracking-widest",
        "transition-all duration-300 active:scale-95", // Scale down on tap for mobile haptics
        
        // --- RESPONSIVE SIZING ---
        // px-6 py-3.5 for mobile (larger touch area)
        // md:px-8 md:py-3 for desktop (sleeker profile)
        "px-6 py-3.5 md:px-8 md:py-3 text-[10px] md:text-xs",
        
        // --- BRAND COLORS ---
        "bg-cobalt-accent text-cobalt-bg", 
        "hover:bg-[#7dd3fc] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]",
        
        "group disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* Label Layer */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* --- SHIMMER EFFECT --- */}
      {/* Hidden on non-hover devices (mobile) to save battery/performance, 
          shown on hover for desktop */}
      <div
        className={cn(
          "absolute inset-0 -translate-x-full",
          "bg-gradient-to-r from-transparent via-white/30 to-transparent",
          "group-hover:translate-x-full transition-transform duration-1000 ease-in-out",
          "hidden md:block" 
        )}
      />

      {/* Mobile-only subtle glow ring on focus */}
      <div className="absolute inset-0 rounded-xl border border-white/0 group-active:border-white/20 transition-colors md:hidden" />
    </button>
  );
}