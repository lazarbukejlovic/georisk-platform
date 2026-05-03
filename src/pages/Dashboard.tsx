import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { conflicts } from "@/data/conflicts";
import { feedItems } from "@/data/feed";
import { IntelligenceHero } from "@/components/dashboard/IntelligenceHero";
import { ConflictDrawer } from "@/components/conflicts/ConflictDrawer";
import { RiskBadge } from "@/components/common/RiskBadge";
import { formatTimeAgo } from "@/lib/risk";
import type { Conflict } from "@/types";
import { TrendingUp, TrendingDown, Eye, AlertTriangle, HeartPulse, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

const RISK_HSL: Record<string, string> = {
  critical: "0 95% 62%",
  high: "16 100% 58%",
  elevated: "38 100% 58%",
  moderate: "205 90% 62%",
  low: "186 58% 55%",
};

export default function Dashboard() {
  const [selected, setSelected] = useState<Conflict | null>(null);
  const [open, setOpen] = useState(false);

  const select = (conflict: Conflict) => {
    setSelected(conflict);
    setOpen(true);
  };

  const feedHighlights = useMemo(
    () => feedItems.filter((item) => item.isPinned || item.severity === "critical").slice(0, 1),
    [],
  );

  return (
    <div className="mx-auto max-w-[1680px] space-y-5 px-4 py-4 lg:px-6 lg:py-5">
      <IntelligenceHero conflicts={conflicts} selectedId={selected?.id} onSelect={select} />

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="grid grid-cols-12 gap-4"
      >
        <div className="panel col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="panel-heading">Live Situation Feed</span>
              <div className="live-chip">
                <span className="pulse-dot" /> Streaming
              </div>
            </div>
            <button className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground">
              View all →
            </button>
          </div>

          {feedHighlights.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 border-b border-border/60 bg-[hsl(var(--risk-critical)/0.05)] px-4 py-3"
            >
              <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--risk-critical))]" />
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="blink text-[9px] font-condensed font-semibold uppercase tracking-[0.16em] text-[hsl(var(--risk-critical))]">
                    Critical
                  </span>
                  <span className="text-[9px] font-condensed uppercase tracking-[0.1em] text-muted-foreground">
                    {item.source} · {item.region} · {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
                <div className="text-[13px] font-semibold leading-snug">{item.headline}</div>
                <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.summary}</div>
              </div>
            </div>
          ))}

          <ul className="scrollbar-thin max-h-[420px] divide-y divide-border/50 overflow-y-auto">
            {feedItems
              .filter((item) => item.severity !== "critical")
              .map((item, index) => (
                <li
                  key={item.id}
                  onClick={() => {
                    if (item.conflictId) {
                      const conflict = conflicts.find((entry) => entry.id === item.conflictId);
                      if (conflict) {
                        select(conflict);
                      }
                    }
                  }}
                  className={cn(
                    "scan-overlay group flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/35",
                    (item.isNew || index === 0) && "feed-highlight",
                  )}
                >
                  <div className="flex flex-col items-center gap-1 pt-1.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: `hsl(${RISK_HSL[item.severity]})`,
                        boxShadow: `0 0 7px hsl(${RISK_HSL[item.severity]} / 0.8)`,
                      }}
                    />
                    {index === 0 && (
                      <span className="blink text-[7px] font-condensed font-bold uppercase tracking-[0.1em] text-[hsl(var(--positive))]">
                        new
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.1em] text-primary">
                        {item.source}
                      </span>
                      <span className="text-[9px] font-condensed uppercase tracking-[0.08em] text-muted-foreground">
                        · {item.sourceType} · {item.region} · {formatTimeAgo(item.timestamp)}
                      </span>
                      <span className="ml-auto">
                        <RiskBadge level={item.severity} />
                      </span>
                    </div>
                    <div className="text-[13px] font-medium leading-snug transition-colors group-hover:text-primary">
                      {item.headline}
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{item.summary}</div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="panel col-span-12 lg:col-span-4">
          <div className="border-b border-border/70 px-4 py-3">
            <div className="panel-heading">Last 24h · Changes</div>
            <div className="mt-0.5 text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              significant intel deltas
            </div>
          </div>
          <ul className="divide-y divide-border/50">
            {[
              {
                icon: TrendingUp,
                color: "ticker-up",
                title: "Brent risk premium +1.4%",
                sub: "Geopolitical spread widens on Red Sea",
              },
              {
                icon: AlertTriangle,
                color: "text-[hsl(var(--risk-critical))]",
                title: "Eastern Europe escalation",
                sub: "Energy infrastructure incidents expand",
              },
              {
                icon: TrendingDown,
                color: "ticker-down",
                title: "BTC -2.1% on risk-off",
                sub: "Drawdown amid global risk repricing",
              },
              {
                icon: HeartPulse,
                color: "text-[hsl(var(--risk-high))]",
                title: "Sahel displacement +6% MoM",
                sub: "Tri-border outflows accelerate",
              },
              {
                icon: Eye,
                color: "text-primary",
                title: "New analyst note · IL/HM",
                sub: "Mediation track resumes; watch energy",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={index}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/35"
                >
                  <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", item.color)} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium leading-snug">{item.title}</div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">{item.sub}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.section>

      <ConflictDrawer conflict={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}

