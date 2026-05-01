import { cn } from "@/lib/utils";
import { scoreToRisk, riskMeta } from "@/lib/risk";

export function ScoreMeter({ score, size = "md", showLabel = true }: { score: number; size?: "sm" | "md" | "lg"; showLabel?: boolean }) {
  const risk = scoreToRisk(score);
  const m = riskMeta[risk];
  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2" };
  const fontSize = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-baseline gap-2">
          <span className={cn("mono font-semibold tabular-nums", fontSize[size], m.text)}>{score}</span>
          <span className="text-[10px] text-muted-foreground mono">/ 100</span>
        </div>
        {showLabel && <span className={cn("text-[10px] uppercase tracking-wider font-medium", m.text)}>{m.label}</span>}
      </div>
      <div className={cn("w-full rounded-full bg-secondary/70 overflow-hidden", heights[size])}>
        <div
          className={cn("h-full rounded-full transition-all", m.text.replace("text-", "bg-"))}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}
