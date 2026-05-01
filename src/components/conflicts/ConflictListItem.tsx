import type { Conflict } from "@/types";
import { RiskBadge } from "@/components/common/RiskBadge";
import { ScoreMeter } from "@/components/common/ScoreMeter";
import { MapPin, CalendarDays, ChevronRight } from "lucide-react";

export function ConflictListItem({ conflict, onSelect }: { conflict: Conflict; onSelect: (c: Conflict) => void }) {
  return (
    <button
      onClick={() => onSelect(conflict)}
      className="w-full text-left panel-flat hover:border-primary/40 hover:bg-secondary/40 transition-colors p-4 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <RiskBadge level={conflict.intensity} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mono">{conflict.type}</span>
          </div>
          <div className="font-display text-base font-medium truncate">{conflict.name}</div>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{conflict.region}</span>
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(conflict.startDate).getFullYear()}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="mt-3">
        <ScoreMeter score={conflict.impactScore} size="sm" />
      </div>
    </button>
  );
}
