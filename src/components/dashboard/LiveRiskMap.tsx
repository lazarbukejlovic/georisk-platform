import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { Conflict, RiskLevel } from "@/types";
import { MAP_RISK_COLORS, RiskLegend } from "@/components/dashboard/RiskLegend";
import { cn } from "@/lib/utils";

const CONTINENTS_PATH = "M152,98 L188,86 L221,90 L249,86 L286,93 L312,86 L344,89 L380,84 L406,90 L438,87 L472,93 L498,99 L520,108 L538,124 L546,142 L548,160 L538,180 L515,196 L490,202 L465,206 L444,216 L432,232 L428,250 L426,272 L416,294 L398,316 L380,336 L356,348 L332,346 L308,338 L286,330 L266,322 L246,316 L228,308 L212,298 L198,286 L186,272 L178,254 L172,232 L166,212 L162,194 L158,176 L154,156 L152,138 Z M548,108 L572,98 L592,90 L612,84 L630,80 L644,86 L654,98 L660,114 L662,132 L658,150 L648,168 L632,186 L618,204 L612,224 L614,244 L622,262 L632,278 L640,294 L644,310 L640,328 L630,346 L616,360 L598,368 L580,366 L564,358 L552,344 L546,328 L544,312 L548,294 L556,276 L562,258 L562,240 L556,220 L548,198 L544,178 L546,158 L546,138 Z M662,118 L688,108 L712,102 L734,98 L756,98 L778,102 L798,108 L818,116 L834,124 L848,134 L856,146 L860,160 L856,176 L846,190 L832,200 L814,206 L796,210 L778,212 L760,216 L744,224 L730,236 L720,250 L716,266 L716,282 L720,298 L728,312 L738,322 L750,330 L762,336 L770,342 L772,352 L766,362 L754,368 L740,366 L726,358 L714,346 L704,330 L696,312 L692,292 L692,272 L696,252 L702,232 L710,212 L716,192 L712,172 L702,152 L688,138 L676,128 Z M40,176 L78,166 L114,168 L142,176 L162,194 L168,216 L160,236 L142,250 L120,258 L96,256 L74,248 L56,234 L46,216 L42,196 Z M180,360 L208,348 L240,344 L272,348 L300,358 L322,374 L334,394 L334,416 L320,432 L298,442 L272,448 L244,448 L218,442 L196,432 L180,418 L172,400 L172,380 Z M340,378 L370,372 L400,376 L424,388 L440,406 L444,424 L436,442 L420,452 L398,456 L374,452 L352,442 L338,426 L334,406 Z M768,388 L800,378 L834,378 L860,386 L880,398 L890,414 L890,432 L876,448 L854,456 L828,456 L800,450 L778,438 L766,422 L764,404 Z";

const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 1000,
  y: ((90 - lat) / 180) * 500,
});

const levelOrder: RiskLevel[] = ["critical", "high", "elevated", "moderate", "low"];
const HORIZONTAL_GRID_LINES = Array.from({ length: 11 }, (_, index) => index * 50);
const VERTICAL_GRID_LINES = Array.from({ length: 21 }, (_, index) => index * 50);

interface LiveRiskMapProps {
  conflicts: Conflict[];
  selectedId?: string | null;
  onSelect: (conflict: Conflict) => void;
}

export const LiveRiskMap = memo(function LiveRiskMap({ conflicts, selectedId, onSelect }: LiveRiskMapProps) {
  const hotspots = useMemo(
    () => [...conflicts].sort((a, b) => b.impactScore - a.impactScore).slice(0, 10),
    [conflicts],
  );

  const counts = useMemo(() => {
    const base: Record<RiskLevel, number> = {
      critical: 0,
      high: 0,
      elevated: 0,
      moderate: 0,
      low: 0,
    };

    conflicts.forEach((conflict) => {
      base[conflict.intensity] += 1;
    });

    return base;
  }, [conflicts]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="panel relative overflow-hidden rounded-3xl"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_12%_14%,hsl(194_90%_64%_/_0.12),transparent_40%),radial-gradient(circle_at_84%_14%,hsl(38_100%_58%_/_0.14),transparent_36%)]" />

      <div className="relative z-10 border-b border-border/70 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="eyebrow text-[hsl(38_90%_64%)]">Global Theater</div>
            <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground md:text-2xl">Live Global Risk Map</h3>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              Active conflict overlays, regional threat clusters, and severity-weighted hotspot tracking.
            </p>
          </div>
          <div className="live-chip mt-1">
            <span className="pulse-dot" />
            Monitoring
          </div>
        </div>
      </div>

      <div className="relative z-10 p-3 md:p-4">
        <div className="relative h-[300px] overflow-hidden rounded-2xl border border-border/75 bg-[linear-gradient(145deg,hsl(219_46%_8%),hsl(223_62%_4.5%))] sm:h-[360px] lg:h-[420px]">
          <div className="radar-sweep" />
          <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="heroMapFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(201 62% 21%)" stopOpacity="0.78" />
                <stop offset="100%" stopColor="hsl(212 65% 10%)" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="heroMapStroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(198 86% 70%)" stopOpacity="0.54" />
                <stop offset="100%" stopColor="hsl(198 86% 70%)" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <g stroke="hsl(198 86% 65% / 0.085)" strokeWidth="0.6">
              {HORIZONTAL_GRID_LINES.map((lineY) => (
                <line key={`h${lineY}`} x1="0" y1={lineY} x2="1000" y2={lineY} />
              ))}
              {VERTICAL_GRID_LINES.map((lineX) => (
                <line key={`v${lineX}`} x1={lineX} y1="0" x2={lineX} y2="500" />
              ))}
            </g>

            <path d={CONTINENTS_PATH} fill="url(#heroMapFill)" stroke="url(#heroMapStroke)" strokeWidth="0.95" />

            {hotspots.map((conflict) => {
              const point = project(conflict.coordinates[0], conflict.coordinates[1]);
              const color = MAP_RISK_COLORS[conflict.intensity];
              const radius = 5 + Math.floor(conflict.impactScore / 21);
              const selected = selectedId === conflict.id;

              return (
                <g
                  key={conflict.id}
                  transform={`translate(${point.x} ${point.y})`}
                  className="cursor-pointer"
                  onClick={() => onSelect(conflict)}
                >
                  <circle
                    r={radius + 3}
                    fill={color}
                    opacity="0.24"
                    className="map-hotspot-pulse"
                  />
                  <circle r={radius} fill={color} stroke="hsl(222 62% 4%)" strokeWidth="0.9" />
                  <circle r="1.35" fill="white" opacity="0.9" />

                  {selected && (
                    <circle
                      r={radius + 7}
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      strokeDasharray="3 2"
                      opacity="0.9"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[10px] text-foreground/70 backdrop-blur">
            Live overlays · WGS84
          </div>

          <RiskLegend className="absolute bottom-3 right-3" />
        </div>
      </div>

      <div className="relative z-10 border-t border-border/70 px-5 py-3 md:px-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {levelOrder.map((level) => (
            <div
              key={level}
              className={cn(
                "rounded-xl border px-2.5 py-2 text-center",
                "border-white/10 bg-black/20",
              )}
            >
              <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {level}
              </div>
              <div className="mt-0.5 font-mono text-sm font-semibold" style={{ color: MAP_RISK_COLORS[level] }}>
                {counts[level]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});
