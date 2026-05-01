import { useEffect, useState } from "react";
import { Search, Activity, Globe2, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { conflicts } from "@/data/conflicts";

export function CommandBar() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const utc = time.toUTCString().slice(17, 25) + " UTC";
  const dateStr = time.toISOString().slice(0, 10);

  const gri = Math.round(conflicts.reduce((s, c) => s + c.impactScore, 0) / conflicts.length);
  const critical = conflicts.filter(c => c.intensity === "critical").length;

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-border/60 bg-[hsl(222_62%_3.5%/0.82)] backdrop-blur-2xl">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="h-full flex items-center gap-4 px-4 lg:px-5">
        {/* Brand */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <div>
            <div className="font-display text-[17px] font-bold tracking-[-0.045em] leading-none text-foreground">
              Geo<span className="text-primary">Risk</span>
            </div>
            <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.24em] text-muted-foreground mt-[3px]">
              Intelligence Terminal
            </div>
          </div>
          <div className="h-7 w-px bg-border/60 mx-1" />
        </div>

        {/* Status bar */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-condensed font-semibold uppercase tracking-[0.16em]">
          <div className="live-chip">
            <span className="pulse-dot" /> Live
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground border border-border/50 rounded-md px-2 py-[3px] bg-secondary/30">
            <Activity className="h-3 w-3" /> 8 sources
          </div>
          <div className="text-muted-foreground border border-border/50 rounded-md px-2 py-[3px] bg-secondary/30">
            <span className="mono">{dateStr}</span>
            <span className="text-foreground/70 ml-1.5 mono">{utc}</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
          <Input
            placeholder="Search conflicts, regions, assets…"
            className="pl-9 pr-14 h-9 rounded-xl bg-secondary/40 border-border/60 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:bg-secondary/60"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-condensed font-semibold text-muted-foreground/60 border border-border/60 rounded px-1.5 py-[3px] bg-background/50 tracking-wide">
            ⌘K
          </kbd>
        </div>

        {/* Metrics */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/60 bg-secondary/35 group hover:border-primary/30 transition-colors">
            <Globe2 className="h-3.5 w-3.5 text-primary" />
            <div className="leading-none">
              <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.2em] text-muted-foreground">GRI</div>
              <div className="font-display text-[13px] font-bold tabular-nums text-glow-cyan leading-tight">{gri}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[hsl(var(--risk-critical)/0.35)] bg-[hsl(var(--risk-critical)/0.07)] group hover:border-[hsl(var(--risk-critical)/0.5)] transition-colors">
            <Zap className="h-3.5 w-3.5 text-[hsl(var(--risk-critical))] blink" />
            <div className="leading-none">
              <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.2em] text-[hsl(var(--risk-critical)/0.8)]">Critical</div>
              <div className="font-display text-[13px] font-bold tabular-nums leading-tight">{critical}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
