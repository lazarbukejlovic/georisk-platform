import { motion } from "framer-motion";
import { reports } from "@/data/reports";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Bookmark, Plus, Bell, Pencil, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const savedBriefs = [
  { title: "Russia–Ukraine: Energy infrastructure outlook", date: "2h ago", tag: "Energy" },
  { title: "Red Sea: Q4 freight & insurance pressure", date: "1d ago", tag: "Trade" },
  { title: "Gulf escalation scenarios", date: "3d ago", tag: "Markets" },
];

const alertRules = [
  { rule: "Eastern Europe · Impact ≥ 85", channel: "Email + In-app", active: true },
  { rule: "Brent · Δ24h > ±2%", channel: "In-app", active: true },
  { rule: "New critical event in MENA", channel: "Email", active: true },
  { rule: "Sahel humanitarian update", channel: "Digest", active: false },
];

const analystNotes = [
  { author: "Analyst", time: "12m ago", note: "Watch for spillover indicators around Eastern Mediterranean shipping routes following recent escalation." },
  { author: "Analyst", time: "2h ago", note: "Brent risk premium widening despite stable physical supply — geopolitical tail premium dominant." },
  { author: "Analyst", time: "1d ago", note: "Sahel: governance shifts continue to compress regional risk visibility for cross-border traders." },
];

export default function ReportsPage() {
  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-[1680px] mx-auto space-y-5">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="eyebrow">Intelligence Workspace</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.04em] mt-2">Reports & Briefs</h1>
        <p className="section-copy mt-2 max-w-2xl">
          Saved intelligence briefs, weekly risk summaries, market exposure reports, and analyst workflow.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="panel-flat p-4">
          <div className="data-label">Saved Reports</div>
          <div className="font-display text-2xl font-bold mt-1.5 tabular-nums">{reports.length}</div>
        </div>
        <div className="panel-flat p-4">
          <div className="data-label">Ready to Export</div>
          <div className="font-display text-2xl font-bold mt-1.5 tabular-nums text-[hsl(var(--positive))]">
            {reports.filter(r => r.status === "ready").length}
          </div>
        </div>
        <div className="panel-flat p-4">
          <div className="data-label">Analyst Notes</div>
          <div className="font-display text-2xl font-bold mt-1.5 tabular-nums">{analystNotes.length}</div>
        </div>
        <div className="panel-flat p-4">
          <div className="data-label">Alert Rules</div>
          <div className="font-display text-2xl font-bold mt-1.5 tabular-nums">{alertRules.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Reports grid */}
        <section className="col-span-12 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="panel-heading">Weekly Reports</div>
            <button className="text-[10px] font-condensed font-semibold uppercase tracking-[0.12em] text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors">
              <Plus className="h-3 w-3" /> New report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(r => (
              <article key={r.id} className="panel p-5 flex flex-col group hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg border border-border bg-secondary/40 grid place-items-center text-primary shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="data-label mb-0.5">{r.category}</div>
                      <div className="font-display text-[14px] font-bold tracking-[-0.02em] leading-tight">{r.title}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-[10px] font-mono text-muted-foreground">{r.pages} pp</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{r.updated}</div>
                  </div>
                </div>

                <p className="text-[13px] text-foreground/80 leading-relaxed flex-1">{r.summary}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-md bg-secondary/60 border border-border/60 text-muted-foreground">
                    {r.audience}
                  </span>
                  <span className={cn(
                    "text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-md border inline-flex items-center gap-1",
                    r.status === "ready"
                      ? "bg-[hsl(var(--positive)/0.1)] border-[hsl(var(--positive)/0.3)] text-[hsl(var(--positive))]"
                      : "bg-secondary/60 border-border/60 text-muted-foreground"
                  )}>
                    {r.status === "ready" && <CheckCircle2 className="h-2.5 w-2.5" />}
                    {r.status === "draft" && <Clock className="h-2.5 w-2.5" />}
                    {r.status}
                  </span>
                </div>

                {/* Mini preview texture */}
                <div className="mt-4 panel-flat p-3 h-16 overflow-hidden grid grid-cols-3 grid-rows-3 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="rounded-sm opacity-50"
                         style={{ background: `hsl(220 30% ${10 + (i % 3) * 4}%)`, border: "1px solid hsl(var(--border))" }} />
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/60">
                  <Button size="sm" className="h-8 text-xs"><Eye className="h-3.5 w-3.5 mr-1.5" />Preview</Button>
                  <Button size="sm" variant="secondary" className="h-8 text-xs"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
                  <Button size="sm" variant="ghost" className="h-8 ml-auto text-muted-foreground hover:text-foreground"><Bookmark className="h-3.5 w-3.5" /></Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="col-span-12 xl:col-span-4 space-y-4">

          {/* Saved briefs */}
          <div className="panel">
            <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between">
              <div className="panel-heading">Saved Briefs</div>
              <span className="text-[9px] font-mono text-muted-foreground">{savedBriefs.length}</span>
            </div>
            <ul>
              {savedBriefs.map((b, i) => (
                <li key={i} className="px-4 py-3 border-b border-border/60 last:border-0 flex items-start gap-3 hover:bg-secondary/35 cursor-pointer group transition-colors">
                  <Bookmark className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium leading-snug">{b.title}</div>
                    <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.1em] text-muted-foreground mt-0.5">
                      <span className="text-primary">{b.tag}</span> · {b.date}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Alert rules */}
          <div className="panel">
            <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-primary" />
                <span className="panel-heading">Alert Rules</span>
              </div>
              <button className="text-[9px] font-condensed font-semibold uppercase tracking-[0.12em] text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                <Plus className="h-3 w-3" /> New
              </button>
            </div>
            <ul>
              {alertRules.map((r, i) => (
                <li key={i} className="px-4 py-3 border-b border-border/60 last:border-0 flex items-center gap-3">
                  <span className={cn("h-1.5 w-1.5 rounded-full shrink-0",
                                      r.active ? "bg-[hsl(var(--positive))]" : "bg-muted-foreground/35")}
                        style={r.active ? { boxShadow: "0 0 8px hsl(var(--positive))" } : {}} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono font-medium">{r.rule}</div>
                    <div className="text-[9px] font-condensed uppercase tracking-[0.1em] text-muted-foreground mt-0.5">{r.channel}</div>
                  </div>
                  <span className={cn(
                    "text-[9px] font-condensed font-bold uppercase tracking-[0.14em]",
                    r.active ? "text-[hsl(var(--positive))]" : "text-muted-foreground"
                  )}>
                    {r.active ? "ON" : "OFF"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Analyst notes */}
          <div className="panel">
            <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="h-3.5 w-3.5 text-primary" />
                <span className="panel-heading">Analyst Notes</span>
              </div>
              <button className="text-[9px] font-condensed font-semibold uppercase tracking-[0.12em] text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                <Plus className="h-3 w-3" /> Add note
              </button>
            </div>
            <ul>
              {analystNotes.map((n, i) => (
                <li key={i} className="px-4 py-3 border-b border-border/60 last:border-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-primary">{n.author}</span>
                    <span className="text-[9px] font-condensed uppercase tracking-[0.1em] text-muted-foreground">· {n.time}</span>
                  </div>
                  <div className="text-[13px] text-foreground/85 leading-relaxed">{n.note}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

