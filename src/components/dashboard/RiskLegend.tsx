import { memo } from "react";
import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

const RISK_LEVELS: RiskLevel[] = ["critical", "high", "elevated", "moderate", "low"];

export const MAP_RISK_COLORS: Record<RiskLevel, string> = {
  critical: "#ff5a5a",
  high: "#ff8a3d",
  elevated: "#f5b84b",
  moderate: "#4ca7ff",
  low: "#4ed0c0",
};

interface RiskLegendProps {
  className?: string;
}

export const RiskLegend = memo(function RiskLegend({ className }: RiskLegendProps) {
  return (
    <div className={cn("glass rounded-xl px-3 py-2", className)}>
      <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
        Risk Legend
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] font-condensed font-semibold uppercase tracking-[0.1em]">
        {RISK_LEVELS.map((level) => (
          <div key={level} className="inline-flex items-center gap-1.5 text-foreground/80">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: MAP_RISK_COLORS[level],
                boxShadow: `0 0 8px ${MAP_RISK_COLORS[level]}99`,
              }}
            />
            {level}
          </div>
        ))}
      </div>
    </div>
  );
});
