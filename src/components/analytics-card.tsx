import React from "react";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtext?: string;
}

export default function AnalyticsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtext
}: AnalyticsCardProps) {
  return (
    <div className="border border-gray-900 bg-gray-950/40 p-6 rounded-xl flex items-start justify-between backdrop-blur-md">
      <div className="space-y-2">
        <span className="font-mono text-[10px] uppercase text-gray-500 tracking-wider block">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{value}</span>
          {change && (
            <span className={`text-xs font-mono font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {isPositive ? "+" : ""}{change}
            </span>
          )}
        </div>
        {subtext && <p className="text-[11px] text-gray-400 leading-none">{subtext}</p>}
      </div>

      <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 shadow-md">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
