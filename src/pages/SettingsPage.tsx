import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Globe2, Coins, Bell, Layout, Database, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Card = ({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  children: ReactNode;
}) => (
  <section className="panel p-5">
    <div className="flex items-start gap-3 mb-5">
      <div className="h-9 w-9 rounded-lg border border-border bg-secondary/40 grid place-items-center text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="panel-heading">{title}</div>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
    {children}
  </section>
);

const Row = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-t border-border/60 first:border-t-0">
    <div>
      <Label className="text-[13px] font-medium">{label}</Label>
      {hint && <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{hint}</div>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button onClick={onClick}
          className={cn(
            "text-[10px] font-condensed font-semibold uppercase tracking-[0.12em] px-2.5 py-1.5 rounded-lg border transition-all",
            active
              ? "bg-primary/10 text-primary border-primary/40 shadow-[0_0_8px_hsl(var(--primary)/0.18)]"
              : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground hover:border-primary/25"
          )}>
    {children}
  </button>
);

export default function SettingsPage() {
  const [regions, setRegions] = useState<string[]>(["Eastern Europe", "Middle East"]);
  const [watchlist, setWatchlist] = useState<string[]>(["Brent", "Gold", "EUR", "BTC"]);
  const [sensitivity, setSensitivity] = useState([60]);
  const [emails, setEmails] = useState(true);
  const [compact, setCompact] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const allRegions = ["Eastern Europe","Middle East","North-East Africa","Southeast Asia","Arabian Peninsula","West Africa","Red Sea Corridor","Latin America"];
  const allAssets = ["Brent","WTI","Gold","BTC","ETH","DXY","EUR","GBP","CHF","SGD","TTF Gas","Wheat"];

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-[1360px] mx-auto space-y-5">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="hero-atmosphere">
        <div className="eyebrow">Workspace</div>
        <h1 className="hero-title mt-2">Preferences & Settings</h1>
        <p className="section-copy mt-2 max-w-2xl">
          Region and asset watchlists, alert rules, dashboard preferences, and account controls.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="panel-flat p-4">
          <div className="data-label">Watched Regions</div>
          <div className="value-stat text-2xl mt-1.5">{regions.length}</div>
        </div>
        <div className="panel-flat p-4">
          <div className="data-label">Watched Assets</div>
          <div className="value-stat text-2xl mt-1.5">{watchlist.length}</div>
        </div>
        <div className="panel-flat p-4">
          <div className="data-label">Alert Sensitivity</div>
          <div className="value-stat text-2xl mt-1.5">{sensitivity[0]}</div>
        </div>
        <div className="panel-flat p-4">
          <div className="data-label">Delivery</div>
          <div className="font-display text-base font-bold mt-1.5 truncate">{emails ? "Email + In-app" : "In-app"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card icon={Globe2} title="Region Watchlist" desc="Prioritise these regions across the dashboard, feed, and alerts.">
          <div className="flex flex-wrap gap-2">
            {allRegions.map(r => <Chip key={r} active={regions.includes(r)} onClick={() => toggle(regions, setRegions, r)}>{r}</Chip>)}
          </div>
        </Card>

        <Card icon={Coins} title="Asset Watchlist" desc="Highlight these assets in market views, dashboard, and reports.">
          <div className="flex flex-wrap gap-2">
            {allAssets.map(a => <Chip key={a} active={watchlist.includes(a)} onClick={() => toggle(watchlist, setWatchlist, a)}>{a}</Chip>)}
          </div>
        </Card>

        <Card icon={Bell} title="Alerts" desc="How aggressive should alerts be?">
          <Row label="Alert sensitivity" hint={`Threshold ${sensitivity[0]} / 100 — only events at or above this Conflict Impact Score will alert.`}>
            <div className="w-[220px]"><Slider value={sensitivity} onValueChange={setSensitivity} max={100} step={5} /></div>
          </Row>
          <Row label="Email digest" hint="Daily roll-up of high-impact events.">
            <Switch checked={emails} onCheckedChange={setEmails} />
          </Row>
          <Row label="Notification email" hint="Where digests are delivered.">
            <Input defaultValue="analyst@georisk.io" className="w-[260px] bg-secondary/60 border-border/70 h-9" />
          </Row>
        </Card>

        <Card icon={Layout} title="Display" desc="Customise the terminal layout.">
          <Row label="Compact density" hint="Tighter spacing across cards and lists."><Switch checked={compact} onCheckedChange={setCompact} /></Row>
          <Row label="Auto-refresh feed" hint="Stream updates every 30s."><Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} /></Row>
          <Row label="Map radar sweep" hint="Animated scanning effect on the global theater."><Switch defaultChecked /></Row>
        </Card>

        <Card icon={Database} title="Data Sources" desc="Preferred upstream sources (mocked — connect APIs in production).">
          <Row label="GDELT" hint="Global event database."><Switch defaultChecked /></Row>
          <Row label="ReliefWeb" hint="Humanitarian situation reports."><Switch defaultChecked /></Row>
          <Row label="ACLED" hint="Armed conflict event tracking."><Switch defaultChecked /></Row>
          <Row label="Wire services" hint="General newswire feed."><Switch /></Row>
        </Card>

        <Card icon={ShieldCheck} title="Account" desc="Workspace identity and security.">
          <Row label="Workspace" hint="Your team's intelligence workspace.">
            <Input defaultValue="Sentinel Research" className="w-[260px] bg-secondary/60 border-border/70 h-9" />
          </Row>
          <Row label="Two-factor auth" hint="Recommended for analyst accounts."><Switch defaultChecked /></Row>
          <Row label="Plan" hint="Pro Terminal · seat 1/5">
            <span className="text-[10px] font-condensed font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/30">PRO</span>
          </Row>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" className="text-[11px] font-condensed font-semibold uppercase tracking-[0.12em]">Reset</Button>
        <Button className="text-[11px] font-condensed font-semibold uppercase tracking-[0.12em]">Save Preferences</Button>
      </div>
    </div>
  );
}
