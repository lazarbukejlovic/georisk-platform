import { useMemo } from "react";
import { motion } from "framer-motion";
import { marketAssets } from "@/data/markets";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import type { MarketAsset } from "@/types";
import { ArrowDownRight, ArrowUpRight, Fuel, Bitcoin, DollarSign, ShieldCheck, Zap, CircleAlert, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { riskMeta } from "@/lib/risk";

function HeroAsset({ asset, accent }: { asset: MarketAsset; accent: string }) {
  const up = asset.change24h >= 0;
  const stroke = up ? "hsl(var(--positive))" : "hsl(var(--negative))";
  const id = `hero-${asset.id}`;
  return (
    <div className="panel p-5 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl pointer-events-none opacity-40" style={{ background: accent }} />
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-[10px] mono uppercase tracking-[0.16em] text-muted-foreground">{asset.symbol} · {asset.venue} · {asset.unit}</div>
          <div className="font-display text-xl font-semibold mt-0.5">{asset.name}</div>
        </div>
        <div className={cn("status-chip", riskMeta[asset.riskLabel].text, riskMeta[asset.riskLabel].border, riskMeta[asset.riskLabel].bg)}>
          {riskMeta[asset.riskLabel].label}
        </div>
      </div>
      <div className="flex items-baseline gap-3 mt-3">
        <div className="font-display text-3xl tabular-nums text-glow-cyan">{asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        <div className={cn("inline-flex items-center text-sm mono font-semibold", up ? "ticker-up" : "ticker-down")}>
          {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {Math.abs(asset.change24h).toFixed(2)}%
        </div>
      </div>
      <div className="h-20 mt-3 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={asset.series}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.5} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.8} fill={`url(#${id})`} />
            <RTooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 11, borderRadius: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] mono uppercase tracking-[0.16em] text-muted-foreground">
        <span>{asset.correlationLabel}</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>{asset.exposureLabel}</span>
      </div>
      <div className="text-[11px] text-muted-foreground leading-relaxed mt-2">{asset.thesis}</div>
    </div>
  );
}

function MiniSparkRow({ asset }: { asset: MarketAsset }) {
  const up = asset.change24h >= 0;
  const stroke = up ? "hsl(var(--positive))" : "hsl(var(--negative))";
  const id = `mini-${asset.id}`;
  const m = riskMeta[asset.riskLabel];
  return (
    <div className="px-4 py-3 border-b border-border last:border-0 grid grid-cols-12 items-center gap-3 hover:bg-secondary/40">
      <div className="col-span-3">
        <div className="text-[11px] mono font-semibold">{asset.symbol}</div>
        <div className="text-[10px] text-muted-foreground truncate">{asset.correlationLabel}</div>
      </div>
      <div className="col-span-3 text-right">
        <div className="text-sm mono tabular-nums">{asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        <div className="text-[9px] mono text-muted-foreground">{asset.unit}</div>
      </div>
      <div className={cn("col-span-2 text-right text-xs mono inline-flex items-center justify-end gap-0.5", up ? "ticker-up" : "ticker-down")}>
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{Math.abs(asset.change24h).toFixed(2)}%
      </div>
      <div className="col-span-2 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={asset.series}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.4} fill={`url(#${id})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="col-span-2 text-right">
        <span className={cn("text-[10px] mono uppercase tracking-wider", m.text)}>{m.label}</span>
      </div>
    </div>
  );
}

function RegimePanel({
  icon: Icon,
  title,
  badgeColor,
  body,
  assets,
}: {
  icon: LucideIcon;
  title: string;
  badgeColor: string;
  body: string;
  assets: MarketAsset[];
}) {
  return (
    <div className="panel">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Icon className={cn("h-4 w-4", badgeColor)} />
        <div className="font-display text-[13px] font-semibold uppercase tracking-[0.14em]">{title}</div>
      </div>
      <div className="px-4 py-3 text-xs text-muted-foreground leading-relaxed border-b border-border">{body}</div>
      <div>{assets.map((a: MarketAsset) => <MiniSparkRow key={a.id} asset={a} />)}</div>
    </div>
  );
}

function TerminalInsight({
  title,
  value,
  sub,
  icon: Icon,
  accentClass,
}: {
  title: string;
  value: string;
  sub: string;
  icon: typeof Fuel;
  accentClass: string;
}) {
  return (
    <div className="panel-flat p-4 panel-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="metric-label">{title}</div>
          <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
        </div>
        <div className={cn("h-10 w-10 rounded-2xl grid place-items-center border border-border bg-secondary/50", accentClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export default function MarketsPage() {
  const energy = marketAssets.filter(a => a.category === "energy");
  const metals = marketAssets.filter(a => a.category === "metals");
  const crypto = marketAssets.filter(a => a.category === "crypto");
  const fx = marketAssets.filter(a => a.category === "fx");
  const safeHaven = useMemo(() => fx.filter(a => ["chf","sgd","usd"].includes(a.id)).concat(metals), [fx, metals]);
  const pressure = useMemo(() => fx.filter(a => ["eur","gbp"].includes(a.id)), [fx]);
  const watched = [energy[0], energy[1], metals[0], fx[0], fx[1], fx[2], fx[3], fx[4], crypto[0], crypto[1]];

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-[1680px] mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="eyebrow">Market Impact Terminal</div>
          <h1 className="section-title mt-2 text-3xl md:text-4xl">Conflict-linked cross-asset monitoring</h1>
          <p className="section-copy mt-2 max-w-3xl">A live commercial risk terminal for energy shocks, safe-haven FX, and crypto volatility. All pricing stays mocked, but structures are ready for CoinGecko, Frankfurter, FRED, and EIA integrations.</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="terminal-pill"><span className="pulse-dot" /> tape live</span>
          <span className="terminal-pill">mocked feeds · api-ready</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <TerminalInsight title="Energy shock" value="Elevated" sub="Brent + Red Sea repricing bias" icon={Fuel} accentClass="text-risk-high" />
        <TerminalInsight title="Safe-haven flows" value="Active" sub="USD, CHF, and gold outperforming" icon={ShieldCheck} accentClass="text-primary" />
        <TerminalInsight title="Currency pressure" value="Focused" sub="EUR and GBP most spillover-sensitive" icon={Landmark} accentClass="text-risk-elevated" />
        <TerminalInsight title="Crypto volatility" value="High beta" sub="BTC and ETH reacting as liquidity assets" icon={Bitcoin} accentClass="text-risk-high" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <HeroAsset asset={energy[0]} accent="hsl(16 100% 58% / 0.4)" />
        <HeroAsset asset={metals[0]} accent="hsl(48 100% 58% / 0.4)" />
        <HeroAsset asset={crypto[0]} accent="hsl(38 100% 58% / 0.4)" />
        <HeroAsset asset={fx[0]} accent="hsl(195 100% 60% / 0.4)" />
      </div>

      <div className="panel overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="font-display text-[13px] font-semibold uppercase tracking-[0.14em]">Terminal Watchlist</div>
          <div className="terminal-pill">Brent · WTI · Gold · BTC · ETH · USD · EUR · GBP · CHF · SGD</div>
        </div>
        <div>
          {watched.map((asset) => <MiniSparkRow key={asset.id} asset={asset} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RegimePanel
          icon={Fuel} badgeColor="text-[hsl(var(--risk-high))]"
          title="Energy Shock Regime"
          body="Active conflict in major producing regions and Red Sea routing pressures lift the Brent and gas risk premium. Monitor for second-round effects on European import inflation."
          assets={energy.concat(metals.filter(m => m.id === "gold"))}
        />
        <RegimePanel
          icon={ShieldCheck} badgeColor="text-[hsl(var(--positive))]"
          title="Safe-Haven Flows"
          body="USD, CHF, and gold tend to be bid in acute risk-off episodes. Liquidity-driven flows rotate toward deep, stable reserve assets during global stress."
          assets={safeHaven}
        />
        <RegimePanel
          icon={DollarSign} badgeColor="text-[hsl(var(--risk-elevated))]"
          title="Currency Pressure"
          body="EUR and GBP remain sensitive to European energy security and Eastern European conflict spillover. Watch ECB / BoE communications for policy paths."
          assets={pressure}
        />
        <RegimePanel
          icon={Bitcoin} badgeColor="text-[hsl(var(--risk-high))]"
          title="Crypto Volatility"
          body="BTC and ETH historically behave as risk assets in acute crises, with sharp drawdowns. Longer-horizon flows can shift between safe-haven and risk regimes."
          assets={crypto}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-4">
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <div className="font-display text-[13px] font-semibold uppercase tracking-[0.14em]">Conflict → Market Transmission</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
            <div>
              <div className="text-[10px] mono uppercase tracking-wider text-primary mb-1">Channel · Energy</div>
              <p className="text-foreground/85">Conflict in producing regions and chokepoints lifts crude and gas premia; rerouting adds freight cost into European import inflation.</p>
            </div>
            <div>
              <div className="text-[10px] mono uppercase tracking-wider text-primary mb-1">Channel · FX</div>
              <p className="text-foreground/85">Risk-off episodes support USD and CHF while conflict-adjacent currencies face capital flight and policy pressure.</p>
            </div>
            <div>
              <div className="text-[10px] mono uppercase tracking-wider text-primary mb-1">Channel · Crypto</div>
              <p className="text-foreground/85">Acute geopolitical stress usually triggers BTC and ETH drawdowns before macro-liquidity narratives reassert themselves.</p>
            </div>
          </div>
        </div>

        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4 text-risk-high" />
            <div className="font-display text-[13px] font-semibold uppercase tracking-[0.14em]">Correlation Notes</div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="panel-flat p-4">
              <div className="metric-label">Primary hedge</div>
              <div className="mt-1 font-display text-lg">Gold + CHF</div>
              <div className="mt-1 text-xs text-muted-foreground">Best suited to broad risk-off and policy uncertainty.</div>
            </div>
            <div className="panel-flat p-4">
              <div className="metric-label">Highest beta</div>
              <div className="mt-1 font-display text-lg">BTC + ETH</div>
              <div className="mt-1 text-xs text-muted-foreground">Most reactive to liquidity compression and headline shocks.</div>
            </div>
            <div className="panel-flat p-4">
              <div className="metric-label">Most conflict-sensitive</div>
              <div className="mt-1 font-display text-lg">Brent + EUR</div>
              <div className="mt-1 text-xs text-muted-foreground">Direct transmission from energy security and European spillover risk.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
