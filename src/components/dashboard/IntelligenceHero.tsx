import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BellRing,
  CandlestickChart,
  Gauge,
  Layers3,
} from "lucide-react";
import type { Conflict } from "@/types";
import { RotatingGlobe } from "@/components/dashboard/RotatingGlobe";
import { GlobalRiskMap } from "@/components/dashboard/GlobalRiskMap";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { marketAssets } from "@/data/markets";
import { feedItems } from "@/data/feed";

interface IntelligenceHeroProps {
  conflicts: Conflict[];
  selectedId?: string | null;
  onSelect: (conflict: Conflict) => void;
}

export function IntelligenceHero({
  conflicts,
  selectedId,
  onSelect,
}: IntelligenceHeroProps) {
  const summary = useMemo(() => {
    const critical = conflicts.filter(
      (conflict) => conflict.intensity === "critical",
    ).length;
    const high = conflicts.filter(
      (conflict) => conflict.intensity === "high",
    ).length;
    const trackedRegions = new Set(
      conflicts.map((conflict) => conflict.region),
    ).size;
    const avgImpact = Math.round(
      conflicts.reduce((sum, conflict) => sum + conflict.impactScore, 0) /
      Math.max(1, conflicts.length),
    );
    const marketShock = marketAssets.filter(
      (asset) => Math.abs(asset.change24h) > 1.5,
    ).length;
    const freshAlerts = feedItems.filter(
      (item) =>
        Date.now() - new Date(item.timestamp).getTime() <
        1000 * 60 * 60 * 8,
    ).length;

    return { critical, high, trackedRegions, avgImpact, marketShock, freshAlerts };
  }, [conflicts]);

  const statCards = [
    {
      icon: Gauge,
      label: "Risk Index",
      value: `${summary.avgImpact}`,
      detail: "Aggregate geopolitical impact score",
      accent: "text-[#f5b84b]",
    },
    {
      icon: AlertTriangle,
      label: "Critical Zones",
      value: `${summary.critical}`,
      detail: "Active conflict areas requiring immediate attention",
      accent: "text-[#ff5a5a]",
    },
    {
      icon: Layers3,
      label: "Risk Domains",
      value: "5",
      detail: "Energy, FX, trade, humanitarian, crypto",
      accent: "text-[#4ca7ff]",
    },
    {
      icon: CandlestickChart,
      label: "Market Shock",
      value: `${summary.marketShock}`,
      detail: "Assets in elevated volatility regime",
      accent: "text-[#f5b84b]",
    },
    {
      icon: BellRing,
      label: "Fresh Intel",
      value: `${summary.freshAlerts}`,
      detail: "Significant alerts in last 8 hours",
      accent: "text-[#4ed0c0]",
    },
  ];

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hero-atmosphere overflow-hidden rounded-3xl border border-border/70 bg-[linear-gradient(150deg,hsl(221_44%_8%_/_0.82),hsl(223_56%_4.2%_/_0.96))] p-5 sm:p-6 lg:p-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <div className="eyebrow mb-1 text-[#d4a853]">
                 Geopolitical Risk Platform
              </div>
              <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-4xl xl:text-[2.8rem]">
                Global Intelligence Dashboard
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-6 text-foreground/70">
                Real-time conflict monitoring, market impact assessment, and
                strategic threat visibility. Built for intelligence analysts and
                policy decision cycles.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="status-chip border-[#ff5a5a33] bg-[#ff5a5a12] text-[#ff7d7d]">
                  <span className="pulse-dot critical" /> {summary.critical} critical
                </span>
                <span className="status-chip border-[#f5b84b33] bg-[#f5b84b10] text-[#f5b84b]">
                  {summary.high} high-risk zones
                </span>
                <span className="status-chip border-[#4ca7ff33] bg-[#4ca7ff10] text-[#4ca7ff]">
                  {summary.trackedRegions} regions
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center lg:mt-6 lg:justify-start">
              <RotatingGlobe />
            </div>
          </div>

          <div className="lg:col-span-7">
            <GlobalRiskMap
              conflicts={conflicts}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        {statCards.map((card, index) => (
          <DashboardStatCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
            detail={card.detail}
            accent={card.accent}
            index={index}
          />
        ))}
      </motion.div>
    </section>
  );
}
