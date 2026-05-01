import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { feedItems } from "@/data/feed";
import { conflicts } from "@/data/conflicts";
import { ConflictDrawer } from "@/components/conflicts/ConflictDrawer";
import { RiskBadge } from "@/components/common/RiskBadge";
import { formatTimeAgo, riskMeta } from "@/lib/risk";
import type { Conflict, FeedImpactCategory, FeedSource, RiskLevel } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Pin, Radio, Filter, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

const RISK_HSL: Record<string, string> = {
  critical: "0 95% 62%",
  high:     "16 100% 58%",
  elevated: "38 100% 58%",
  moderate: "48 100% 58%",
  low:      "152 75% 48%",
};

export default function FeedPage() {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("all");
  const [src, setSrc] = useState("all");
  const [region, setRegion] = useState("all");
  const [impact, setImpact] = useState<FeedImpactCategory | "all">("all");
  const [selected, setSelected] = useState<Conflict | null>(null);
  const [open, setOpen] = useState(false);

  const regions = useMemo(() => Array.from(new Set(feedItems.map(f => f.region))), []);
  const sources = useMemo(() => Array.from(new Set(feedItems.map(f => f.source))) as FeedSource[], []);

  const filtered = useMemo(() => feedItems.filter(it =>
    (q === "" || it.headline.toLowerCase().includes(q.toLowerCase()) || it.summary.toLowerCase().includes(q.toLowerCase())) &&
    (sev === "all" || it.severity === sev as RiskLevel) &&
    (src === "all" || it.source === src) &&
    (region === "all" || it.region === region) &&
    (impact === "all" || it.impactCategory === impact)
  ), [q, sev, src, region, impact]);

  const pinned = filtered.filter(f => f.isPinned || f.severity === "critical");
  const stream = filtered.filter(f => f.severity !== "critical");

  const counts = useMemo(() => {
    const c: Record<string, number> = { critical: 0, high: 0, elevated: 0, moderate: 0, low: 0 };
    feedItems.forEach(f => c[f.severity]++);
    return c;
  }, []);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-[1600px] mx-auto space-y-5">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="hero-atmosphere flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="eyebrow">Intelligence Stream</div>
          <h1 className="hero-title mt-2">Situation Feed</h1>
          <p className="section-copy mt-2 max-w-2xl">
            Neutral analytical summaries with severity, source, region, and impact tagging.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="live-chip"><span className="pulse-dot" /> Streaming</div>
          <span className="status-chip">
            <Globe2 className="h-3 w-3" /> {feedItems.length} items
          </span>
        </div>
      </motion.div>

      {/* Severity counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["critical", "high", "elevated", "moderate", "low"] as RiskLevel[]).map(r => {
          const m = riskMeta[r];
          const active = sev === r;
          return (
            <button key={r} onClick={() => setSev(active ? "all" : r)}
                    className={cn(
                      "panel-flat p-3 text-left transition-all",
                      active ? "border-primary/35 bg-secondary/45 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]" : "hover:bg-secondary/35"
                    )}>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full"
                      style={{ background: `hsl(${RISK_HSL[r]})`, boxShadow: `0 0 7px hsl(${RISK_HSL[r]} / 0.8)` }} />
                <span className={cn("text-[9px] font-condensed font-semibold uppercase tracking-[0.18em]", m.text)}>{m.label}</span>
              </div>
              <div className="font-display text-2xl font-bold tabular-nums leading-none">{counts[r]}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="panel p-3 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input value={q} onChange={e => setQ(e.target.value)}
                 placeholder="Search headlines, summaries…"
                 className="pl-9 bg-secondary/50 border-border/60 text-sm" />
        </div>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-[172px] bg-secondary/50 border-border/60 text-sm">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={src} onValueChange={setSrc}>
          <SelectTrigger className="w-[152px] bg-secondary/50 border-border/60 text-sm">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {sources.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={impact} onValueChange={(v) => setImpact(v as FeedImpactCategory | "all")}>
          <SelectTrigger className="w-[172px] bg-secondary/50 border-border/60 text-sm">
            <SelectValue placeholder="Impact" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All impacts</SelectItem>
            {["security", "energy", "trade", "currency", "humanitarian", "policy"].map(v => (
              <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button onClick={() => { setQ(""); setSev("all"); setSrc("all"); setRegion("all"); setImpact("all"); }}
                className="text-[10px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-3 transition-colors">
          <Filter className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* Pinned criticals */}
      {pinned.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 eyebrow px-0.5" style={{ color: "hsl(var(--risk-critical))" }}>
            <Pin className="h-3 w-3" /> Pinned · Critical priority
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pinned.map(f => (
              <div key={f.id}
                   onClick={() => { if (f.conflictId) { const c = conflicts.find(x => x.id === f.conflictId); if (c) { setSelected(c); setOpen(true); } } }}
                   className="panel p-4 border-l-2 border-l-[hsl(var(--risk-critical)/0.7)] bg-[hsl(var(--risk-critical)/0.04)] cursor-pointer hover:bg-[hsl(var(--risk-critical)/0.08)] transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-condensed font-bold uppercase tracking-[0.18em] text-[hsl(var(--risk-critical))] blink">Critical</span>
                  <span className="text-[9px] font-condensed uppercase tracking-[0.1em] text-muted-foreground">
                    · {f.source} · {f.sourceType} · {f.region} · {formatTimeAgo(f.timestamp)}
                  </span>
                </div>
                <div className="text-[13px] font-semibold leading-snug">{f.headline}</div>
                <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{f.summary}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[8px] font-condensed font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-md border border-border/60 bg-secondary/40 text-muted-foreground">
                    {f.impactCategory}
                  </span>
                  {f.relatedConflict && (
                    <span className="text-[8px] font-condensed font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-md border border-border/60 bg-secondary/40 text-muted-foreground">
                      {f.relatedConflict}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stream */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 panel">
          <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Radio className="h-3.5 w-3.5 text-primary" />
              <span className="panel-heading">Event Stream</span>
            </div>
            <span className="text-[9px] font-mono text-muted-foreground">{stream.length} items</span>
          </div>
          <ul>
            {stream.map((f, i) => (
              <li key={f.id}
                  onClick={() => { if (f.conflictId) { const c = conflicts.find(x => x.id === f.conflictId); if (c) { setSelected(c); setOpen(true); } } }}
                  className={cn(
                    "px-4 py-4 border-b border-border/50 last:border-0 hover:bg-secondary/35 cursor-pointer group flex items-start gap-4 transition-colors",
                    (f.isNew || i === 0) && "feed-highlight"
                  )}>
                {/* Timestamp + indicator */}
                <div className="meta-text w-14 mt-0.5 tabular-nums shrink-0">{formatTimeAgo(f.timestamp)}</div>
                <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0"
                      style={{ background: `hsl(${RISK_HSL[f.severity]})`, boxShadow: `0 0 7px hsl(${RISK_HSL[f.severity]} / 0.8)` }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.1em] text-primary">{f.source}</span>
                    <span className="text-[9px] font-condensed uppercase tracking-[0.08em] text-muted-foreground">
                      · {f.sourceType} · {f.region}
                    </span>
                    <span className="ml-auto"><RiskBadge level={f.severity} /></span>
                  </div>
                  <div className="text-[13px] font-medium leading-snug group-hover:text-primary transition-colors">{f.headline}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{f.summary}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="text-[8px] font-condensed font-semibold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">
                      {f.impactCategory}
                    </span>
                    {f.relatedConflict && (
                      <span className="text-[8px] font-condensed font-semibold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">
                        {f.relatedConflict}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {stream.length === 0 && (
            <div className="px-4 py-12 text-center">
              <div className="text-sm text-muted-foreground">No items match the current filters.</div>
            </div>
          )}
        </div>

        {/* Sidebar stats */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <div className="panel">
            <div className="px-4 py-3 border-b border-border/70">
              <div className="panel-heading">Source Breakdown</div>
            </div>
            <ul>
              {sources.map(s => {
                const c = feedItems.filter(f => f.source === s).length;
                return (
                  <li key={s} className="data-strip">
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-medium text-foreground/85">{s}</span>
                    </div>
                    <div className="h-1 flex-1 rounded-full bg-border overflow-hidden max-w-[80px]">
                      <div className="h-full rounded-full bg-primary/60" style={{ width: `${(c / feedItems.length) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-5 text-right">{c}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="panel">
            <div className="px-4 py-3 border-b border-border/70">
              <div className="panel-heading">Impact Categories</div>
            </div>
            <ul>
              {["security", "energy", "trade", "currency", "humanitarian", "policy"].map(cat => {
                const c = feedItems.filter(f => f.impactCategory === cat).length;
                return (
                  <li key={cat} className="data-strip">
                    <div className="flex-1">
                      <span className="text-[11px] font-condensed font-semibold uppercase tracking-[0.1em] text-foreground/75 capitalize">{cat}</span>
                    </div>
                    <div className="h-1 flex-1 rounded-full bg-border overflow-hidden max-w-[80px]">
                      <div className="h-full rounded-full bg-accent/60" style={{ width: `${(c / feedItems.length) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-5 text-right">{c}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <ConflictDrawer conflict={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
