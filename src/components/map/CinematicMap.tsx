import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Conflict, RiskLevel } from "@/types";
import { riskMeta } from "@/lib/risk";

const RISK_HSL: Record<RiskLevel, string> = {
  critical: "0 95% 62%",
  high:     "16 100% 58%",
  elevated: "38 100% 58%",
  moderate: "48 100% 58%",
  low:      "152 75% 48%",
};

// Equirectangular projection (lat,lng) -> viewBox 1000x500
const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 1000,
  y: ((90 - lat) / 180) * 500,
});

// Trade-pressure arcs
const ARCS: { from: [number, number]; to: [number, number]; intensity: RiskLevel; label: string }[] = [
  { from: [48.4, 31.2], to: [50.1, 8.7],   intensity: "critical", label: "EU energy corridor" },
  { from: [12.6, 43.3], to: [1.3, 103.8],  intensity: "high",     label: "Suez reroute" },
  { from: [12.6, 43.3], to: [51.5, -0.1],  intensity: "high",     label: "Container route" },
  { from: [31.5, 34.5], to: [25.3, 51.5],  intensity: "elevated", label: "Gulf transit" },
  { from: [15.5, 32.6], to: [30.0, 31.2],  intensity: "elevated", label: "Nile corridor" },
  { from: [21.9, 95.9], to: [13.7, 100.5], intensity: "moderate", label: "ASEAN flows" },
];

// Heat risk zones
const HEAT_ZONES = [
  { lat: 48, lng: 32, r: 88,  level: "critical" as RiskLevel },
  { lat: 32, lng: 36, r: 65,  level: "critical" as RiskLevel },
  { lat: 15, lng: 33, r: 75,  level: "high"     as RiskLevel },
  { lat: 14, lng: 47, r: 58,  level: "high"     as RiskLevel },
  { lat: 15, lng: 0,  r: 80,  level: "high"     as RiskLevel },
  { lat: 22, lng: 96, r: 58,  level: "elevated" as RiskLevel },
  { lat: 35, lng: 38, r: 48,  level: "elevated" as RiskLevel },
];

const CONTINENTS_PATH = "M152,98 L188,86 L221,90 L249,86 L286,93 L312,86 L344,89 L380,84 L406,90 L438,87 L472,93 L498,99 L520,108 L538,124 L546,142 L548,160 L538,180 L515,196 L490,202 L465,206 L444,216 L432,232 L428,250 L426,272 L416,294 L398,316 L380,336 L356,348 L332,346 L308,338 L286,330 L266,322 L246,316 L228,308 L212,298 L198,286 L186,272 L178,254 L172,232 L166,212 L162,194 L158,176 L154,156 L152,138 Z M548,108 L572,98 L592,90 L612,84 L630,80 L644,86 L654,98 L660,114 L662,132 L658,150 L648,168 L632,186 L618,204 L612,224 L614,244 L622,262 L632,278 L640,294 L644,310 L640,328 L630,346 L616,360 L598,368 L580,366 L564,358 L552,344 L546,328 L544,312 L548,294 L556,276 L562,258 L562,240 L556,220 L548,198 L544,178 L546,158 L546,138 Z M662,118 L688,108 L712,102 L734,98 L756,98 L778,102 L798,108 L818,116 L834,124 L848,134 L856,146 L860,160 L856,176 L846,190 L832,200 L814,206 L796,210 L778,212 L760,216 L744,224 L730,236 L720,250 L716,266 L716,282 L720,298 L728,312 L738,322 L750,330 L762,336 L770,342 L772,352 L766,362 L754,368 L740,366 L726,358 L714,346 L704,330 L696,312 L692,292 L692,272 L696,252 L702,232 L710,212 L716,192 L712,172 L702,152 L688,138 L676,128 Z M40,176 L78,166 L114,168 L142,176 L162,194 L168,216 L160,236 L142,250 L120,258 L96,256 L74,248 L56,234 L46,216 L42,196 Z M180,360 L208,348 L240,344 L272,348 L300,358 L322,374 L334,394 L334,416 L320,432 L298,442 L272,448 L244,448 L218,442 L196,432 L180,418 L172,400 L172,380 Z M340,378 L370,372 L400,376 L424,388 L440,406 L444,424 L436,442 L420,452 L398,456 L374,452 L352,442 L338,426 L334,406 Z M768,388 L800,378 L834,378 L860,386 L880,398 L890,414 L890,432 L876,448 L854,456 L828,456 L800,450 L778,438 L766,422 L764,404 Z";

export function CinematicMap({
  conflicts,
  selectedId,
  onSelect,
  height = "560px",
}: {
  conflicts: Conflict[];
  selectedId?: string | null;
  onSelect: (c: Conflict) => void;
  height?: string;
}) {
  const [hover, setHover] = useState<Conflict | null>(null);
  const arcs = useMemo(() => ARCS.map(a => ({
    ...a,
    p1: project(a.from[0], a.from[1]),
    p2: project(a.to[0], a.to[1]),
  })), []);
  const selectedConflict = conflicts.find(c => c.id === selectedId);

  return (
    <div
      className="relative panel overflow-hidden grid-bg-fine scanlines scan-overlay live-grid"
      style={{ height, background: "radial-gradient(ellipse 120% 90% at 50% 50%, hsl(220 45% 6.5%) 0%, hsl(222 62% 3%) 75%)" }}
    >
      {/* Radar sweep */}
      <div className="radar-sweep" />

      {/* SVG world */}
      <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
        <defs>
          {/* Continent fills */}
          <linearGradient id="continentFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(204 50% 22%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(210 55% 12%)" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="continentStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(195 100% 62%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(195 100% 72%)" stopOpacity="0.28" />
          </linearGradient>

          {/* Heat zone gradients */}
          <radialGradient id="heatCritical" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(0 95% 62%)" stopOpacity="0.52" />
            <stop offset="60%" stopColor="hsl(0 95% 62%)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(0 95% 62%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heatHigh" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(16 100% 58%)" stopOpacity="0.40" />
            <stop offset="60%" stopColor="hsl(16 100% 58%)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(16 100% 58%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heatElevated" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(38 100% 58%)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="hsl(38 100% 58%)" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.8" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowSoft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Lat/lng grid */}
        <g stroke="hsl(195 100% 60% / 0.055)" strokeWidth="0.5">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
          ))}
          {Array.from({ length: 21 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
          ))}
        </g>
        {/* Major parallels: equator, tropics */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="hsl(195 100% 60% / 0.14)" strokeWidth="0.8" strokeDasharray="6 8" />
        <line x1="0" y1="185" x2="1000" y2="185" stroke="hsl(195 100% 60% / 0.08)" strokeWidth="0.5" strokeDasharray="4 10" />
        <line x1="0" y1="315" x2="1000" y2="315" stroke="hsl(195 100% 60% / 0.08)" strokeWidth="0.5" strokeDasharray="4 10" />

        {/* Heat zones */}
        <g>
          {HEAT_ZONES.map((z, i) => {
            const p = project(z.lat, z.lng);
            const grad = z.level === "critical" ? "heatCritical" : z.level === "high" ? "heatHigh" : "heatElevated";
            return <circle key={i} cx={p.x} cy={p.y} r={z.r} fill={`url(#${grad})`} />;
          })}
        </g>

        {/* Continents */}
        <path d={CONTINENTS_PATH}
              fill="url(#continentFill)"
              stroke="url(#continentStroke)"
              strokeWidth="0.7"
              strokeLinejoin="round" />

        {/* Trade arcs */}
        <g fill="none" strokeLinecap="round">
          {arcs.map((a, i) => {
            const mx = (a.p1.x + a.p2.x) / 2;
            const my = (a.p1.y + a.p2.y) / 2 - Math.abs(a.p2.x - a.p1.x) * 0.20 - 18;
            const stroke = `hsl(${RISK_HSL[a.intensity]})`;
            return (
              <g key={i}>
                {/* Glow backing */}
                <path d={`M ${a.p1.x} ${a.p1.y} Q ${mx} ${my} ${a.p2.x} ${a.p2.y}`}
                      stroke={stroke} strokeOpacity="0.14" strokeWidth="2.5" />
                {/* Animated dash */}
                <path d={`M ${a.p1.x} ${a.p1.y} Q ${mx} ${my} ${a.p2.x} ${a.p2.y}`}
                      stroke={stroke} strokeOpacity="0.90" strokeWidth="1.2"
                      className="flow-line" filter="url(#glow)" />
              </g>
            );
          })}
        </g>

        {/* Conflict markers */}
        <g>
          {conflicts.map(c => {
            const p = project(c.coordinates[0], c.coordinates[1]);
            const color = `hsl(${RISK_HSL[c.intensity]})`;
            const r = 3.5 + Math.round(c.impactScore / 24);
            const isSelected = selectedId === c.id;
            const isCritical = c.intensity === "critical" || c.intensity === "high";
            return (
              <g key={c.id} transform={`translate(${p.x} ${p.y})`} className="cursor-pointer"
                 onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)}
                 onClick={() => onSelect(c)}>

                {/* Outer pulse rings for critical/high */}
                {isCritical && (
                  <>
                    <circle r={r + 2} fill={color} opacity="0.28"
                            style={{ transformOrigin: "center", animation: "ping-marker 2.6s cubic-bezier(0,0,0.2,1) infinite" }} />
                    <circle r={r + 2} fill={color} opacity="0.18"
                            style={{ transformOrigin: "center", animation: "ping-marker 2.6s cubic-bezier(0,0,0.2,1) infinite", animationDelay: "1.3s" }} />
                  </>
                )}

                {/* Selected ring with crosshair */}
                {isSelected && (
                  <>
                    <circle r={r + 7} fill="none" stroke={color} strokeWidth="0.8" opacity="0.9" strokeDasharray="3 2" />
                    <line x1={-(r + 11)} y1="0" x2={-(r + 4)} y2="0" stroke={color} strokeWidth="0.8" opacity="0.7" />
                    <line x1={(r + 4)} y1="0" x2={(r + 11)} y2="0" stroke={color} strokeWidth="0.8" opacity="0.7" />
                    <line x1="0" y1={-(r + 11)} x2="0" y2={-(r + 4)} stroke={color} strokeWidth="0.8" opacity="0.7" />
                    <line x1="0" y1={(r + 4)} x2="0" y2={(r + 11)} stroke={color} strokeWidth="0.8" opacity="0.7" />
                  </>
                )}

                {/* Glow halo */}
                <circle r={r + 2} fill={color} opacity="0.28" filter="url(#glowSoft)" />
                {/* Core */}
                <circle r={r} fill={color} stroke="hsl(222 62% 4%)" strokeWidth="0.8" />
                {/* Center dot */}
                <circle r={1.2} fill="hsl(0 0% 100%)" opacity="0.9" />
                {/* Transparent hit area */}
                <circle r={Math.max(r + 8, 12)} fill="transparent" />
              </g>
            );
          })}
        </g>

        {/* Equator label */}
        <text x="8" y="254" fontSize="5" fill="hsl(195 100% 60% / 0.35)"
              fontFamily="'JetBrains Mono', monospace" letterSpacing="0.04em">EQ 0°</text>
      </svg>

      {/* Hover tooltip */}
      {hover && (
        <div className="absolute pointer-events-none glass px-3 py-2 text-xs slide-up-fade z-30"
             style={{
               left: `${(project(hover.coordinates[0], hover.coordinates[1]).x / 1000) * 100}%`,
               top: `${(project(hover.coordinates[0], hover.coordinates[1]).y / 500) * 100}%`,
               transform: "translate(-50%, -135%)",
             }}>
          <div className="font-display text-[12px] font-semibold whitespace-nowrap">{hover.name}</div>
          <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.16em] text-muted-foreground mt-0.5">
            <span style={{ color: `hsl(${RISK_HSL[hover.intensity]})` }}>{riskMeta[hover.intensity].label}</span>
            {" · "}Impact <span className="text-foreground">{hover.impactScore}</span>
          </div>
        </div>
      )}

      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 38%, hsl(222 62% 3% / 0.42) 100%)" }} />

      {/* Status overlay — top left */}
      <div className="absolute top-3 left-3 z-20 glass px-3 py-1.5 flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-[9px] font-condensed font-semibold uppercase tracking-[0.18em]">
          <span className="pulse-dot" />
          <span className="text-[hsl(var(--positive))]">Scanning</span>
        </div>
        <div className="h-2.5 w-px bg-border" />
        <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="text-foreground">{conflicts.length}</span> active
        </div>
        <div className="h-2.5 w-px bg-border" />
        <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="text-[hsl(var(--risk-critical))]">{conflicts.filter(c => c.intensity === "critical").length}</span> critical
        </div>
      </div>

      {/* Intensity legend — top right */}
      <div className="absolute top-3 right-3 z-20 glass px-3 py-1.5">
        <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1.5">Risk Level</div>
        <div className="flex items-center gap-2.5 text-[9px] font-condensed font-semibold uppercase tracking-[0.1em]">
          {(["low", "moderate", "elevated", "high", "critical"] as RiskLevel[]).map(k => (
            <div key={k} className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full"
                    style={{ background: `hsl(${RISK_HSL[k]})`, boxShadow: `0 0 6px hsl(${RISK_HSL[k]} / 0.7)` }} />
              <span className="capitalize text-foreground/70">{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map metadata — bottom left */}
      <div className="absolute bottom-3 left-3 z-20 glass px-3 py-1.5">
        <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          EQUIRECT · WGS84
        </div>
        <div className="text-[9px] font-mono text-foreground/70 mt-0.5">multi-theater overlay</div>
      </div>

      {/* Trade routes legend — bottom right */}
      <div className="absolute bottom-3 right-3 z-20 glass px-3 py-1.5">
        <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">Trade pressure</div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-foreground/70">
          <span className="h-[1px] w-6 block"
                style={{ background: "linear-gradient(90deg, transparent, hsl(0 95% 62%), transparent)" }} />
          live route flow
        </div>
      </div>

      {/* Selected conflict panel — bottom center */}
      {selectedConflict && (
        <motion.div
          key={selectedConflict.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
        >
          <div className="glass px-4 py-3 min-w-[24rem]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Selected Conflict</div>
                <div className="font-display text-[15px] font-bold leading-tight">{selectedConflict.name}</div>
                <div className="text-[10px] font-condensed uppercase tracking-[0.12em] text-muted-foreground mt-0.5">
                  {selectedConflict.region}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Impact</div>
                <div className="font-display text-2xl font-bold tabular-nums"
                     style={{ color: `hsl(${RISK_HSL[selectedConflict.intensity]})` }}>
                  {selectedConflict.impactScore}
                </div>
                <div className="text-[8px] font-condensed font-semibold uppercase tracking-[0.16em] mt-0.5"
                     style={{ color: `hsl(${RISK_HSL[selectedConflict.intensity]})` }}>
                  {selectedConflict.intensity}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

