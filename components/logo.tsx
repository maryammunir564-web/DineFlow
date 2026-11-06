import React from "react";

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCD6CA] bg-[#F4EFE6] shadow-xs">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#A37A3C]"
          aria-hidden="true"
        >
          {/* Stylized geometric cloche & table connection icon */}
          <path d="M3 19H21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path
            d="M5 19C5 13.5 8.134 9 12 9C15.866 9 19 13.5 19 19"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path d="M12 5V9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="12" cy="4" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-serif text-xl font-bold tracking-tight text-[#1C1917]">
          Dine<span className="text-[#A37A3C]">Flow</span>
        </span>
      </div>
    </div>
  );
}
