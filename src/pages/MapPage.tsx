import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CinematicMap } from "@/components/map/CinematicMap";
import { ConflictDrawer } from "@/components/conflicts/ConflictDrawer";
import { conflicts } from "@/data/conflicts";
import { riskMeta } from "@/lib/risk";
import type { Conflict, RiskLevel } from "@/types";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, Activity, AlertTriangle, Globe2, Orbit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MapPage() {
  const [selected, setSelected] = useState<Conflict | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [intensity, setIntensity] = useState<RiskLevel | "all">("all");

  const select = (c: Conflict) => { setSelected(c); setOpen(true); };

  const list = useMemo(() => conflicts
    .filter(c =>
      (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.region.toLowerCase().includes(q.toLowerCase())) &&
      (intensity === "all" || c.intensity === intensity)
    )
    .sort((a, b) => b.impactScore - a.impactScore), [q, intensity]);
  const criticalCount = list.filter((conflict) => conflict.intensity === "critical").length;
  const averageScore = Math.round(list.reduce((sum, conflict) => sum + conflict.impactScore, 0) / Math.max(1, list.length));
  const exposedRegions = new Set(list.map((conflict) => conflict.region)).size;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-[1680px] mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="hero-atmosphere flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="eyebrow">Global Theater</div>
          <h1 className="hero-title mt-2">Map-Led Global Risk Monitoring</h1>
          <p className="section-copy mt-2 max-w-3xl">Cinematic world view for active conflicts, regional glow zones, and trade-pressure arcs. Built for analyst triage, not decorative mapping.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 xl:w-[32rem]">
          <div className="panel-flat p-4 panel-lift">
            <div className="metric-label">Global Risk Index</div>
            <div className="mt-2 flex items-baseline gap-2"><span className="font-display text-3xl font-semibold">{averageScore}</span><span className="text-xs text-muted-foreground">/ 100</span></div>
          </div>
          <div className="panel-flat p-4 panel-lift">
            <div className="metric-label">Critical Zones</div>
            <div className="mt-2 flex items-baseline gap-2"><span className="font-display text-3xl font-semibold text-risk-critical">{criticalCount}</span><span className="text-xs text-muted-foreground">active</span></div>
          </div>
          <div className="panel-flat p-4 panel-lift">
            <div className="metric-label">Watched Regions</div>
            <div className="mt-2 flex items-baseline gap-2"><span className="font-display text-3xl font-semibold">{exposedRegions}</span><span className="text-xs text-muted-foreground">tracked</span></div>
          </div>
          <div className="panel-flat p-4 panel-lift">
            <div className="metric-label">Trade Pressure</div>
            <div className="mt-2 flex items-baseline gap-2"><span className="font-display text-3xl font-semibold text-primary">{list.filter((conflict) => conflict.impactCategories.includes("trade")).length}</span><span className="text-xs text-muted-foreground">linked theaters</span></div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-9">
          <CinematicMap conflicts={list} selectedId={selected?.id} onSelect={select} height="min(74vh, 760px)" />
        </div>

        <aside className="col-span-12 xl:col-span-3 panel flex flex-col max-h-[760px] live-grid">
          <div className="px-4 py-3 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="panel-heading">Conflict Registry</div>
              <div className="terminal-pill"><span className="pulse-dot" /> live</div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search theaters or regions…" className="pl-8 h-9 bg-secondary/60 border-border/70 text-xs rounded-xl" />
            </div>
            <div className="flex flex-wrap gap-1">
              {(["all","critical","high","elevated","moderate","low"] as const).map(k => (
                <button key={k} onClick={() => setIntensity(k as RiskLevel | "all")}
                        className={cn("text-[10px] font-condensed font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded border transition-colors",
                          intensity === k ? "bg-primary/15 text-primary border-primary/40" : "border-border text-muted-foreground hover:text-foreground")}>
                  {k}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="panel-flat p-3">
                <div className="metric-label">Scanning</div>
                <div className="mt-1 inline-flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-primary" /> {list.length} nodes</div>
              </div>
              <div className="panel-flat p-3">
                <div className="metric-label">Active Watch</div>
                <div className="mt-1 inline-flex items-center gap-2"><Orbit className="h-3.5 w-3.5 text-risk-high" /> {selected ? selected.region : "Global"}</div>
              </div>
            </div>
          </div>
          <ul className="overflow-y-auto scrollbar-thin">
            {list.map(c => (
              <li key={c.id} onClick={() => select(c)}
                  className={cn("px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/40 cursor-pointer flex items-center gap-3 group",
                    selected?.id === c.id && "bg-secondary/60")}>
                <span className={cn("h-2 w-2 rounded-full shrink-0", riskMeta[c.intensity].text.replace("text-","bg-"))}
                      style={{ boxShadow: `0 0 10px hsl(var(--risk-${c.intensity}))` }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-[10px] mono text-muted-foreground">{c.region} · {c.type}</div>
                </div>
                <div className="text-right">
                  <div className={cn("text-sm font-bold tabular-nums mono", riskMeta[c.intensity].text)}>{c.impactScore}</div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">impact</div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 border-t border-border bg-secondary/20">
            <div className="metric-label mb-2">Legend</div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-risk-critical" /> Critical nodes use expanded pulse rings and persistent glow.</div>
              <div className="flex items-center gap-2"><Globe2 className="h-3.5 w-3.5 text-primary" /> Trade arcs show pressure transfer between conflict zones and market nodes.</div>
            </div>
          </div>
        </aside>
      </div>

      <ConflictDrawer conflict={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
