import React from "react";

interface StatusBadgeProps {
  label: string;
  indicator?: "active" | "preparing" | "neutral";
}

export function StatusBadge({ label, indicator = "preparing" }: StatusBadgeProps) {
  const dotColor =
    indicator === "active"
      ? "bg-emerald-600"
      : indicator === "preparing"
        ? "bg-[#A37A3C]"
        : "bg-stone-400";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E4DEC3] bg-[#FDFBF7] px-3.5 py-1 text-xs font-medium text-[#57534E] shadow-xs">
      <span className={`h-2 w-2 rounded-full ${dotColor} animate-pulse`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
