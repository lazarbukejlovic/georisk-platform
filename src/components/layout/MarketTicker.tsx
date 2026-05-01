import { marketAssets } from "@/data/markets";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketTicker() {
  const stream = [...marketAssets, ...marketAssets];

  return (
    <div className="h-9 border-t border-border/60 bg-[hsl(222_62%_3.5%/0.92)] backdrop-blur-2xl overflow-hidden relative">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      {/* Label */}
      <div className="absolute inset-y-0 left-0 z-10 flex items-center gap-2.5 px-4 bg-gradient-to-r from-[hsl(222_62%_3.5%)] via-[hsl(222_62%_3.5%/0.95)] to-transparent pr-12">
        <span className="pulse-dot" />
        <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.2em] text-[hsl(var(--positive))]">Markets</span>
        <div className="h-3 w-px bg-border/50" />
        <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.16em] text-muted-foreground">Live tape</span>
      </div>

      {/* Right fade */}
      <div className="absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[hsl(222_62%_3.5%)] to-transparent pointer-events-none" />

      <div className="marquee h-full items-center">
        {stream.map((a, i) => {
          const up = a.change24h >= 0;
          return (
            <div key={i} className="flex items-center gap-2.5 px-5 h-full text-[10.5px] whitespace-nowrap border-r border-border/30 group cursor-default hover:bg-secondary/20 transition-colors">
              <span className="font-condensed font-semibold uppercase tracking-[0.1em] text-muted-foreground group-hover:text-foreground transition-colors">{a.symbol}</span>
              <span className="font-mono tabular-nums text-foreground/90">
                {a.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={cn("inline-flex items-center gap-0.5 font-mono tabular-nums text-[10px]", up ? "ticker-up" : "ticker-down")}>
                {up ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                {Math.abs(a.change24h).toFixed(2)}%
              </span>
              <span className="text-[8.5px] font-condensed font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">{a.exposureLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
