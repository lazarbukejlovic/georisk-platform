import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { conflicts } from "@/data/conflicts";
import { feedItems } from "@/data/feed";
import { marketAssets } from "@/data/markets";
import { CinematicMap } from "@/components/map/CinematicMap";
import { ConflictDrawer } from "@/components/conflicts/ConflictDrawer";
import { RiskBadge } from "@/components/common/RiskBadge";
import { formatTimeAgo, riskMeta, scoreToRisk } from "@/lib/risk";
import type { Conflict, RiskLevel } from "@/types";
import {
  Flame, Globe2, Fuel, Coins, Bitcoin, HeartPulse, ChevronRight,
  TrendingUp, TrendingDown, Eye, Plus, Activity, AlertTriangle, Pin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const RISK_HSL: Record<string, string> = {
  critical: "0 95% 62%",
  high:     "16 100% 58%",
  elevated: "38 100% 58%",
  moderate: "48 100% 58%",
  low:      "152 75% 48%",
};

/* ─── GRI Ring ─── */
function GRIRing({ value }: { value: number }) {
  const r = 44, c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  const risk = scoreToRisk(value);
  const color = `hsl(var(--risk-${risk}))`;
  return (
    <div className="relative h-[116px] w-[116px] grid place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90 drop-shadow-lg">
        {/* Track */}
        <circle cx="50" cy="50" r={r} stroke="hsl(var(--border))" strokeWidth="5.5" fill="none" />
        {/* Low indicator ticks */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((f, i) => {
          const a = f * 2 * Math.PI - Math.PI / 2;
          const x1 = 50 + (r - 3) * Math.cos(a);
          const y1 = 50 + (r - 3) * Math.sin(a);
          const x2 = 50 + (r + 3) * Math.cos(a);
          const y2 = 50 + (r + 3) * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--border))" strokeWidth="0.8" />;
        })}
        {/* Value arc */}
        <circle cx="50" cy="50" r={r} stroke={color} strokeWidth="5.5" fill="none"
                strokeLinecap="round" strokeDasharray={`${dash} ${c}`}
                style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      <div className="text-center leading-none z-10">
        <div className="font-display text-[32px] font-bold tabular-nums text-glow-cyan leading-none">{value}</div>
        <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.22em] text-muted-foreground mt-1.5">GRI</div>
      </div>
    </div>
  );
}

/* ─── Metric chip ─── */
function MetricChip({
  label,
  value,
  level,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  level: RiskLevel;
  icon: LucideIcon;
}) {
  const m = riskMeta[level];
  return (
    <div className="panel-flat p-3 flex items-center gap-3 group hover:border-primary/20 transition-colors">
      <div className={cn("h-8 w-8 rounded-lg grid place-items-center border shrink-0", m.bg, m.border, m.text)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="data-label">{label}</div>
        <div className={cn("font-display text-[15px] font-bold mt-0.5 leading-none", m.text)}>{value}</div>
      </div>
    </div>
  );
}

/* ─── Mini sparkline ─── */
function MiniSpark({ data, up }: { data: { v: number }[]; up: boolean }) {
  const w = 60, h = 18;
  const vs = data.map(d => d.v);
  const min = Math.min(...vs), max = Math.max(...vs), span = max - min || 1;
  const pts = vs.map((v, i) => `${(i / (vs.length - 1)) * w},${h - ((v - min) / span) * h}`).join(" ");
  const color = up ? "hsl(var(--positive))" : "hsl(var(--negative))";
  return (
    <svg width={w} height={h} className="overflow-visible shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.3"
                style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

/* ─── Dashboard ─── */
export default function Dashboard() {
  const [selected, setSelected] = useState<Conflict | null>(null);
  const [open, setOpen] = useState(false);
  const select = (c: Conflict) => { setSelected(c); setOpen(true); };

  const gri = useMemo(() => Math.round(conflicts.reduce((s, c) => s + c.impactScore, 0) / conflicts.length), []);
  const top = useMemo(() => [...conflicts].sort((a, b) => b.impactScore - a.impactScore).slice(0, 5), []);

  const energy = scoreToRisk(Math.round(conflicts.filter(c => c.impactCategories.includes("energy")).reduce((s, c) => s + c.scoreBreakdown.energy, 0) / Math.max(1, conflicts.filter(c => c.impactCategories.includes("energy")).length)));
  const fx = scoreToRisk(Math.round(conflicts.reduce((s, c) => s + c.scoreBreakdown.currency, 0) / conflicts.length));
  const cryptoVol = scoreToRisk(Math.abs(marketAssets.find(a => a.id === "btc")!.change24h) > 1.5 ? 78 : 55);
  const human = scoreToRisk(Math.round(conflicts.reduce((s, c) => s + c.scoreBreakdown.humanitarian, 0) / conflicts.length));

  const watchAssets = ["brent", "gold", "btc", "eur", "usd"]
    .map(id => marketAssets.find(a => a.id === id))
    .filter(Boolean) as typeof marketAssets;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-5 max-w-[1680px] mx-auto space-y-4">

      {/* ── TOP: GRI + domain metrics ── */}
      <motion.section
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
        className="grid grid-cols-12 gap-4 hero-atmosphere"
      >
        {/* GRI panel */}
        <div className="col-span-12 xl:col-span-4 panel p-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/12 blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="eyebrow">Global Risk Index</div>
              <div className="meta-text mt-1.5 text-foreground/70">
                Aggregate signal · 24h
              </div>
            </div>
            <div className="live-chip">
              <span className="pulse-dot" /> Live
            </div>
          </div>
          <div className="flex items-center gap-5 mt-1">
            <GRIRing value={gri} />
            <div className="flex-1 space-y-2">
              {[
                { label: "Energy stress", level: energy },
                { label: "FX pressure",   level: fx },
                { label: "Crypto vol",    level: cryptoVol },
                { label: "Humanitarian",  level: human },
              ].map(({ label, level }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                  <span className={cn("text-[10px] font-condensed font-semibold uppercase tracking-[0.14em]", riskMeta[level].text)}>
                    {riskMeta[level].label}
                  </span>
                </div>
              ))}
              <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: "var(--gradient-risk)", opacity: 0.55 }} />
            </div>
          </div>
        </div>

        {/* Domain metrics grid */}
        <div className="col-span-12 xl:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricChip label="Active Conflicts" value={conflicts.length}                                                                  level="high"     icon={Flame} />
          <MetricChip label="Critical Zones"  value={conflicts.filter(c => c.intensity === "critical").length}                          level="critical" icon={AlertTriangle} />
          <MetricChip label="Energy Stress"   value={riskMeta[energy].label}                                                            level={energy}   icon={Fuel} />
          <MetricChip label="FX Pressure"     value={riskMeta[fx].label}                                                                level={fx}       icon={Coins} />
          <MetricChip label="Crypto Vol"      value={riskMeta[cryptoVol].label}                                                         level={cryptoVol} icon={Bitcoin} />
          <MetricChip label="Humanitarian"    value={riskMeta[human].label}                                                             level={human}    icon={HeartPulse} />
          <MetricChip label="Tracked Regions" value={new Set(conflicts.map(c => c.region)).size}                                        level="elevated" icon={Globe2} />
          <MetricChip label="24h Updates"     value={feedItems.filter(f => Date.now() - new Date(f.timestamp).getTime() < 86400000).length} level="moderate" icon={Activity} />
        </div>
      </motion.section>

      {/* ── MIDDLE: Map + Intel briefing ── */}
      <section className="grid grid-cols-12 gap-4 hero-atmosphere">
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.48, delay: 0.05 }}
          className="col-span-12 xl:col-span-8"
        >
          <div className="flex items-center justify-between mb-2 px-0.5">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-[13px] font-bold uppercase tracking-[0.16em]">Global Theater</span>
              <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.16em] text-muted-foreground">· real-time conflict overlay</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-chip text-[hsl(var(--risk-critical))] border-[hsl(var(--risk-critical)/0.3)] bg-[hsl(var(--risk-critical)/0.07)]">
                <span className="pulse-dot critical" /> {top.filter(c => c.intensity === "critical").length} critical
              </span>
              <span className="status-chip text-[hsl(var(--risk-elevated))] border-[hsl(var(--risk-elevated)/0.3)] bg-[hsl(var(--risk-elevated)/0.07)]">
                <span className="pulse-dot amber" /> {conflicts.filter(c => c.intensity === "high").length} high
              </span>
            </div>
          </div>
          <CinematicMap conflicts={conflicts} selectedId={selected?.id} onSelect={select} height="560px" />
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.44, delay: 0.1 }}
          className="col-span-12 xl:col-span-4 space-y-4"
        >
          {/* Top conflicts */}
          <div className="panel">
            <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between">
              <div>
                <div className="panel-heading">Top Active Conflicts</div>
                <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground mt-0.5">ranked by impact score</div>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">{top.length} / {conflicts.length}</span>
            </div>
            <ul>
              {top.map((c, i) => (
                <li key={c.id}
                    onClick={() => select(c)}
                    className="px-4 py-3 border-b border-border/60 last:border-0 hover:bg-secondary/35 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-muted-foreground w-4 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="h-2 w-2 rounded-full shrink-0"
                          style={{ background: `hsl(${RISK_HSL[c.intensity]})`, boxShadow: `0 0 8px hsl(${RISK_HSL[c.intensity]} / 0.8)` }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold leading-tight truncate">{c.name}</div>
                      <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.12em] text-muted-foreground mt-0.5">{c.region}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-[15px] font-bold tabular-nums leading-none"
                           style={{ color: `hsl(${RISK_HSL[c.intensity]})` }}>{c.impactScore}</div>
                      <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground mt-0.5">{c.intensity}</div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Watchlist */}
          <div className="panel">
            <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between">
              <div className="panel-heading">Watchlist</div>
              <button className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <ul>
              {watchAssets.map(a => {
                const up = a.change24h >= 0;
                return (
                  <li key={a.id} className="px-4 py-2.5 border-b border-border/60 last:border-0 flex items-center gap-3 hover:bg-secondary/35 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold font-mono">{a.symbol}</div>
                      <div className="text-[9px] font-condensed uppercase tracking-[0.1em] text-muted-foreground truncate mt-0.5">{a.exposureLabel}</div>
                    </div>
                    <MiniSpark data={a.series} up={up} />
                    <div className="text-right w-20 shrink-0">
                      <div className="text-[11px] font-mono tabular-nums font-semibold">
                        {a.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={cn("text-[9px] font-mono inline-flex items-center justify-end gap-0.5 w-full", up ? "ticker-up" : "ticker-down")}>
                        {up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                        {Math.abs(a.change24h).toFixed(2)}%
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.aside>
      </section>

      {/* ── BOTTOM: Live feed + 24h changes ── */}
      <section className="grid grid-cols-12 gap-4">
        {/* Live feed */}
        <div className="col-span-12 lg:col-span-8 panel">
          <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="panel-heading">Live Situation Feed</span>
              <div className="live-chip">
                <span className="pulse-dot" /> Streaming
              </div>
            </div>
            <button className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </button>
          </div>

          {feedItems.filter(f => f.isPinned || f.severity === "critical").slice(0, 1).map(f => (
            <div key={f.id} className="px-4 py-3 border-b border-border/60 bg-[hsl(var(--risk-critical)/0.05)] flex items-start gap-3">
              <Pin className="h-3.5 w-3.5 text-[hsl(var(--risk-critical))] mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.16em] text-[hsl(var(--risk-critical))] blink">Critical</span>
                  <span className="text-[9px] font-condensed uppercase tracking-[0.1em] text-muted-foreground">{f.source} · {f.region} · {formatTimeAgo(f.timestamp)}</span>
                </div>
                <div className="text-[13px] font-semibold leading-snug">{f.headline}</div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{f.summary}</div>
              </div>
            </div>
          ))}

          <ul className="divide-y divide-border/50 max-h-[400px] overflow-y-auto scrollbar-thin">
            {feedItems.filter(f => f.severity !== "critical").map((f, idx) => (
                <li key={f.id}
                  onClick={() => { if (f.conflictId) { const c = conflicts.find(x => x.id === f.conflictId); if (c) select(c); } }}
                  className={cn("px-4 py-3 hover:bg-secondary/35 cursor-pointer group flex items-start gap-3 transition-colors scan-overlay", (f.isNew || idx === 0) && "feed-highlight")}
              >
                <div className="flex flex-col items-center pt-1.5 gap-1">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: `hsl(${RISK_HSL[f.severity]})`, boxShadow: `0 0 7px hsl(${RISK_HSL[f.severity]} / 0.8)` }} />
                  {idx === 0 && <span className="text-[7px] font-condensed font-bold uppercase tracking-[0.1em] text-[hsl(var(--positive))] blink">new</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.1em] text-primary">{f.source}</span>
                    <span className="text-[9px] font-condensed uppercase tracking-[0.08em] text-muted-foreground">· {f.sourceType} · {f.region} · {formatTimeAgo(f.timestamp)}</span>
                    <span className="ml-auto"><RiskBadge level={f.severity} /></span>
                  </div>
                  <div className="text-[13px] font-medium leading-snug group-hover:text-primary transition-colors">{f.headline}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{f.summary}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 24h changes */}
        <div className="col-span-12 lg:col-span-4 panel">
          <div className="px-4 py-3 border-b border-border/70">
            <div className="panel-heading">Last 24h · Changes</div>
            <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground mt-0.5">significant intel deltas</div>
          </div>
          <ul className="divide-y divide-border/50">
            {[
              { icon: TrendingUp,    color: "ticker-up",                               title: "Brent risk premium +1.4%",      sub: "Geopolitical spread widens on Red Sea" },
              { icon: AlertTriangle, color: "text-[hsl(var(--risk-critical))]",         title: "Eastern Europe escalation",     sub: "Energy infrastructure incidents expand" },
              { icon: TrendingDown,  color: "ticker-down",                             title: "BTC −2.1% on risk-off",         sub: "Drawdown amid global risk repricing" },
              { icon: HeartPulse,   color: "text-[hsl(var(--risk-high))]",             title: "Sahel displacement +6% MoM",    sub: "Tri-border outflows accelerate" },
              { icon: Eye,          color: "text-primary",                             title: "New analyst note · IL/HM",      sub: "Mediation track resumes; watch energy" },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <li key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-secondary/35 transition-colors">
                  <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", it.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium leading-snug">{it.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{it.sub}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ConflictDrawer conflict={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}

