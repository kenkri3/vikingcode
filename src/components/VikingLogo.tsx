import React from "react";

export function VikingLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(124,58,237,0.65)]"
      >
        <defs>
          <linearGradient id="vikingGradLeft" x1="10%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
          <linearGradient id="vikingGradRight" x1="90%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="60%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#311068" />
          </linearGradient>
          <linearGradient id="vikingGradFacet" x1="50%" y1="20%" x2="50%" y2="90%">
            <stop offset="0%" stopColor="#EDE9FE" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>

        {/* Sharp Faceted V Geometry */}
        {/* Left Wing */}
        <polygon points="12,18 40,18 50,86 32,86" fill="url(#vikingGradLeft)" />
        {/* Right Wing */}
        <polygon points="88,18 60,18 50,86 68,86" fill="url(#vikingGradRight)" />
        {/* Sharp Center Blade / Facet */}
        <polygon points="50,26 60,18 50,86 40,18" fill="url(#vikingGradFacet)" opacity="0.9" />
        {/* Top Sharp Notch */}
        <polygon points="50,38 42,20 58,20" fill="#0A0D12" />
      </svg>
    </div>
  );
}
