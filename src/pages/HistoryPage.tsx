import { useState } from "react";
import { motion } from "framer-motion";
import { historicalWars } from "@/data/history";
import { BookOpen, MapPin, GitCompareArrows, Quote, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const startYear = (years: string) => parseInt(years.split(/[-–]/)[0], 10);
const endYear = (years: string) => {
  const part = years.split(/[-–]/)[1]?.trim();
  if (!part || part.toLowerCase().startsWith("pres")) return new Date().getFullYear();
  return parseInt(part, 10);
};

export default function HistoryPage() {
  const sorted = [...historicalWars].sort((a, b) => startYear(a.years) - startYear(b.years));
  const minY = startYear(sorted[0].years);
  const maxY = endYear(sorted[sorted.length - 1].years);
  const span = maxY - minY;

  const [active, setActive] = useState(sorted[sorted.length - 1].id);
  const activeWar = sorted.find(w => w.id === active)!;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-[1520px] mx-auto space-y-5">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="eyebrow">History Archive</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.04em] mt-2">Historical Conflict Reference</h1>
        <p className="section-copy mt-2 max-w-2xl">
          Major conflicts from 1914 to the present — economic effects, causal structures, and analytical lessons for current geopolitical risk assessment.
        </p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="panel-flat p-4">
          <div className="data-label">Archive Coverage</div>
          <div className="font-display text-2xl font-bold mt-1.5">{sorted.length}</div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">Major conflicts and geopolitical turning points.</div>
        </div>
        <div className="panel-flat p-4">
          <div className="data-label">Time Span</div>
          <div className="font-display text-2xl font-bold mt-1.5">{maxY - minY}<span className="text-base font-normal text-muted-foreground ml-1">years</span></div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">From World War I to Russia–Ukraine.</div>
        </div>
        <div className="panel-flat p-4">
          <div className="data-label">Active Case</div>
          <div className="font-display text-base font-bold mt-1.5 truncate">{activeWar.name}</div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">Selected for comparative analysis.</div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="panel-heading">Interactive Timeline · {minY}–{maxY}</span>
          </div>
          <div className="text-[9px] font-mono text-muted-foreground">{sorted.length} events</div>
        </div>
        <div className="relative h-20 select-none">
          {/* Background gradient axis */}
          <div className="absolute left-0 right-0 top-1/2 h-px"
               style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary)/0.5) 15%, hsl(var(--primary)/0.5) 85%, transparent)" }} />
          {/* Decade ticks */}
          {Array.from({ length: Math.floor(span / 10) + 1 }).map((_, i) => {
            const y = minY + i * 10;
            const left = ((y - minY) / span) * 100;
            return (
              <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                   style={{ left: `${left}%` }}>
                <div className="h-2.5 w-px bg-border" />
                <div className="text-[8px] font-mono text-muted-foreground mt-1">{y}</div>
              </div>
            );
          })}
          {/* Event markers */}
          {sorted.map(w => {
            const left = ((startYear(w.years) - minY) / span) * 100;
            const isActive = w.id === active;
            return (
              <button key={w.id}
                      onClick={() => setActive(w.id)}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                      style={{ left: `${left}%` }}>
                <div className={cn(
                  "h-3 w-3 rounded-full transition-all duration-200",
                  isActive
                    ? "bg-primary shadow-[0_0_14px_hsl(var(--primary))] scale-125"
                    : "bg-foreground/25 hover:bg-primary/70 hover:shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
                )} />
                <div className={cn(
                  "absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded transition-opacity",
                  isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                )}>
                  {w.years.split(/[-–]/)[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail + cards */}
      <div className="grid grid-cols-12 gap-4">

        {/* Detail panel */}
        <div className="col-span-12 lg:col-span-5">
          <motion.div key={activeWar.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="panel p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="eyebrow text-primary">Featured · {activeWar.years}</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-[-0.04em] leading-tight">{activeWar.name}</h2>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-condensed font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {activeWar.region}
              </span>
            </div>

            <p className="text-[13px] text-foreground/85 mt-4 leading-relaxed">{activeWar.description}</p>

            <div className="mt-5">
              <div className="data-label mb-2">Main Causes</div>
              <div className="flex flex-wrap gap-1.5">
                {activeWar.causes.map(c => (
                  <span key={c} className="text-[10px] font-condensed font-semibold uppercase tracking-[0.1em] px-2 py-1 rounded-md bg-secondary/60 border border-border/60 text-foreground/75">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="data-label mb-2">Economic Legacy</div>
              <p className="text-[13px] text-foreground/80 leading-relaxed">{activeWar.economicImpact}</p>
            </div>

            <div className="mt-5">
              <div className="data-label mb-2">Analytical Lessons</div>
              <div className="space-y-2">
                {activeWar.lessonsLearned.map((lesson, i) => (
                  <div key={i} className="panel-flat p-3 text-[12px] text-foreground/80 leading-relaxed border-l-2 border-l-primary/40">
                    {lesson}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 text-[10px] font-condensed font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/18 transition-colors">
                <GitCompareArrows className="h-3 w-3" /> Compare with current
              </button>
              <button className="inline-flex items-center gap-1.5 text-[10px] font-condensed font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-lg bg-secondary/60 text-foreground/70 border border-border/60 hover:bg-secondary transition-colors">
                <Quote className="h-3 w-3" /> Cite source
              </button>
            </div>
          </motion.div>
        </div>

        {/* Card grid */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {sorted.map(w => {
            const isActive = w.id === active;
            return (
              <button key={w.id}
                      onClick={() => setActive(w.id)}
                      className={cn(
                        "panel-flat p-4 text-left transition-all group",
                        isActive
                          ? "border-primary/45 bg-secondary/45 shadow-[0_0_0_1px_hsl(var(--primary)/0.22)]"
                          : "hover:border-primary/25 hover:bg-secondary/35"
                      )}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-[9px] font-condensed font-semibold uppercase tracking-[0.16em]",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>{w.years}</span>
                  <span className="text-[9px] font-condensed uppercase tracking-[0.1em] text-muted-foreground">{w.region.split("/")[0].trim()}</span>
                </div>
                <div className="font-display text-[14px] font-bold tracking-[-0.02em] leading-tight">{w.name}</div>
                <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug line-clamp-3">{w.description}</div>
                <div className="mt-3 text-[8px] font-condensed font-semibold uppercase tracking-[0.16em] text-primary">
                  {w.lessonsLearned.length} lessons
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
