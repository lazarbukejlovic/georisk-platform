import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScoreMeter } from "@/components/common/ScoreMeter";
import { RiskBadge } from "@/components/common/RiskBadge";
import type { Conflict } from "@/types";
import { feedItems } from "@/data/feed";
import { historicalWars } from "@/data/history";
import { formatTimeAgo, riskMeta } from "@/lib/risk";
import { CalendarDays, MapPin, Sparkles, Bookmark, Activity, Users, HeartPulse, TrendingUp, BookOpen, Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Section = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: LucideIcon }) => (
  <div className="panel-flat p-4">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-3">
      <Icon className="h-3 w-3" /> {title}
    </div>
    {children}
  </div>
);

export function ConflictDrawer({ conflict, open, onOpenChange }: {
  conflict: Conflict | null; open: boolean; onOpenChange: (o: boolean) => void;
}) {
  if (!conflict) return null;
  const c = conflict;

  const related = feedItems.filter(f => f.conflictId === c.id).slice(0, 4);
  const histMatch = historicalWars.find(h => h.region.toLowerCase().includes(c.region.toLowerCase().split(" ")[0]) || h.name.toLowerCase().includes(c.country.toLowerCase().split(" ")[0]));

  const m = riskMeta[c.intensity];
  const regionalExposure = Math.round((c.scoreBreakdown.trade + c.scoreBreakdown.economic + c.scoreBreakdown.market) / 3);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 bg-background border-l border-border overflow-y-auto scrollbar-thin"
      >
        {/* Header with intensity glow */}
        <div className="relative">
          <div className={cn("absolute inset-0 opacity-30 pointer-events-none", m.bg)}
               style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }} />
          <SheetHeader className="relative p-6 border-b border-border space-y-3">
            <div className="flex items-center gap-2">
              <RiskBadge level={c.intensity} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground mono">{c.type}</span>
              <span className="ml-auto status-chip"><span className={cn("h-1.5 w-1.5 rounded-full blink", m.text.replace("text-","bg-"))} /> active</span>
            </div>
            <SheetTitle className="font-display text-2xl text-left text-glow-cyan">{c.name}</SheetTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mono">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.region} · {c.country}</span>
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Since {new Date(c.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => toast.success("Brief queued", { description: `Generating intel brief for ${c.name}…` })}>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />Generate brief
              </Button>
              <Button size="sm" variant="secondary" className="h-8"
                      onClick={() => toast.success("Region tracked", { description: `${c.region} added to your watchlist.` })}>
                <Bookmark className="h-3.5 w-3.5 mr-1.5" />Track region
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="panel-flat p-3 text-left">
                <div className="metric-label">Regional Exposure</div>
                <div className="mt-1 font-display text-xl">{regionalExposure}</div>
              </div>
              <div className="panel-flat p-3 text-left">
                <div className="metric-label">Market Assets</div>
                <div className="mt-1 font-display text-xl">{c.relatedAssets.length}</div>
              </div>
              <div className="panel-flat p-3 text-left">
                <div className="metric-label">Update Bias</div>
                <div className="mt-1 font-display text-xl capitalize">{c.intensity}</div>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-4">
          {/* Score panel */}
          <div className="panel p-4 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl pointer-events-none opacity-50" style={{ background: `hsl(var(--risk-${c.intensity}))` }} />
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">Conflict Impact Score</div>
            <ScoreMeter score={c.impactScore} size="lg" />
            <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
              Composite estimate based on conflict activity, market sensitivity, regional economic exposure, and humanitarian indicators. Analytical product, not investment advice.
            </p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-5 w-full bg-secondary/60">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
              <TabsTrigger value="context">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3 mt-3">
              <Section title="Summary" icon={Activity}>
                <p className="text-sm text-foreground/90 leading-relaxed">{c.summary}</p>
              </Section>
              <Section title="Latest Update" icon={Radio}>
                <p className="text-sm text-foreground/90 leading-relaxed">{c.latestUpdate}</p>
              </Section>
              <Section title="Commercial Lens" icon={TrendingUp}>
                <p className="text-sm text-foreground/90 leading-relaxed">{c.marketImpact}</p>
              </Section>
              <Section title="Key Actors" icon={Users}>
                <div className="flex flex-wrap gap-1.5">
                  {c.keyActors.map(a => (
                    <span key={a} className="text-xs px-2 py-1 rounded-md bg-secondary/70 border border-border">{a}</span>
                  ))}
                </div>
              </Section>
              <Section title="Score Breakdown" icon={Activity}>
                <div className="space-y-2.5">
                  {Object.entries(c.scoreBreakdown).map(([k, v]) => (
                    <div key={k}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="capitalize text-muted-foreground mono">{k}</span>
                        <span className="mono tabular-nums text-foreground">{v}</span>
                      </div>
                      <div className="h-1 bg-secondary/70 rounded-full overflow-hidden">
                        <div className="h-full" style={{ width: `${v}%`, background: `linear-gradient(90deg, hsl(var(--primary)/0.6), hsl(var(--primary)))` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-3 mt-3">
              <Section title="Major Events" icon={CalendarDays}>
                <ol className="space-y-3 relative pl-4 before:content-[''] before:absolute before:left-1 before:top-1 before:bottom-1 before:w-px before:bg-border">
                  {c.timeline.map((t, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[14px] top-1.5 h-2 w-2 rounded-full bg-primary" style={{ boxShadow: "0 0 8px hsl(var(--primary))" }} />
                      <div className="text-[11px] mono text-primary">{t.date}</div>
                      <div className="text-sm text-foreground/90">{t.event}</div>
                    </li>
                  ))}
                </ol>
              </Section>
            </TabsContent>

            <TabsContent value="impact" className="space-y-3 mt-3">
              <Section title="Humanitarian Impact" icon={HeartPulse}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="panel-flat p-3">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider mono">Displaced</div>
                    <div className="font-display text-xl mt-1">{c.humanitarianImpact.displaced}</div>
                  </div>
                  <div className="panel-flat p-3">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider mono">Affected</div>
                    <div className="font-display text-xl mt-1">{c.humanitarianImpact.affected}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.humanitarianImpact.note}</p>
              </Section>
              <Section title="Market Exposure" icon={TrendingUp}>
                <p className="text-sm text-foreground/90 leading-relaxed">{c.marketImpact}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {c.relatedAssets.map(a => (
                    <span key={a} className="text-[11px] mono px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/30">{a}</span>
                  ))}
                </div>
              </Section>
              <Section title="Regional Exposure" icon={Activity}>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="panel-flat p-3"><div className="metric-label">Trade</div><div className="mt-1 text-lg font-display">{c.scoreBreakdown.trade}</div></div>
                  <div className="panel-flat p-3"><div className="metric-label">Currency</div><div className="mt-1 text-lg font-display">{c.scoreBreakdown.currency}</div></div>
                  <div className="panel-flat p-3"><div className="metric-label">Economic</div><div className="mt-1 text-lg font-display">{c.scoreBreakdown.economic}</div></div>
                </div>
              </Section>
              <Section title="Impact Categories" icon={Activity}>
                <div className="flex flex-wrap gap-1.5">
                  {c.impactCategories.map(cat => (
                    <span key={cat} className="text-xs px-2 py-1 rounded-md bg-secondary/70 border border-border capitalize">{cat}</span>
                  ))}
                </div>
              </Section>
            </TabsContent>

            <TabsContent value="related" className="space-y-3 mt-3">
              <Section title="Related Feed Items" icon={Radio}>
                {related.length === 0 ? (
                  <div className="text-xs text-muted-foreground">No directly linked feed items in window.</div>
                ) : (
                  <ul className="space-y-2.5">
                    {related.map(r => (
                      <li key={r.id} className="flex items-start gap-3 text-sm">
                        <span className={cn("h-1.5 w-1.5 rounded-full mt-2", riskMeta[r.severity].text.replace("text-","bg-"))} />
                        <div className="flex-1">
                          <div className="text-[10px] mono uppercase tracking-wider text-muted-foreground">
                            {r.source} · {formatTimeAgo(r.timestamp)}
                          </div>
                          <div className="text-sm text-foreground/90">{r.headline}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </TabsContent>

            <TabsContent value="context" className="space-y-3 mt-3">
              <Section title="Historical Context" icon={BookOpen}>
                {histMatch ? (
                  <>
                    <div className="text-[10px] mono uppercase tracking-wider text-primary mb-1">{histMatch.years}</div>
                    <div className="font-display text-base font-semibold mb-1">{histMatch.name}</div>
                    <p className="text-sm text-foreground/85 leading-relaxed">{histMatch.description}</p>
                    <div className="text-[10px] mono uppercase tracking-wider text-muted-foreground mt-3 mb-1">Economic legacy</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{histMatch.economicImpact}</p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">See History Archive for analogous historical conflicts and economic legacies.</p>
                )}
              </Section>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
