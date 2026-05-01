import { riskMeta } from "@/lib/risk";
import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const m = riskMeta[level];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
      m.bg, m.text, m.border, className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.text.replace("text-", "bg-"))} />
      {m.label}
    </span>
  );
}
