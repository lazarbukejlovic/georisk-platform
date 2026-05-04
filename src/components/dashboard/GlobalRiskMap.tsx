import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import * as d3Geo from "d3-geo";
import type { Conflict, RiskLevel } from "@/types";
import { MAP_RISK_COLORS, RiskLegend } from "@/components/dashboard/RiskLegend";
import { cn } from "@/lib/utils";
import { loadWorldCountries } from "@/lib/worldAtlas";

const levelOrder: RiskLevel[] = ["critical", "high", "elevated", "moderate", "low"];

interface GlobalRiskMapProps {
  conflicts: Conflict[];
  selectedId?: string | null;
  onSelect: (conflict: Conflict) => void;
}

export const GlobalRiskMap = memo(function GlobalRiskMap({
  conflicts,
  selectedId,
  onSelect,
}: GlobalRiskMapProps) {
  const [countries, setCountries] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const countriesData = await loadWorldCountries();
        if (mounted) {
          setCountries(countriesData);
        }
      } catch (error) {
        console.error("Failed to load world data:", error);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const projection = useMemo(() => {
    if (!countries) {
      return null;
    }

    return d3Geo.geoMercator().fitSize([960, 500], { type: "Sphere" });
  }, [countries]);

  const geoGenerator = useMemo(() => {
    if (!projection) {
      return null;
    }

    return d3Geo.geoPath().projection(projection);
  }, [projection]);

  const countryPaths = useMemo(() => {
    if (!countries || !geoGenerator) {
      return [];
    }

    return countries
      .map((country, idx) => ({
        id: `map-country-${idx}`,
        d: geoGenerator(country) || "",
      }))
      .filter((entry) => entry.d);
  }, [countries, geoGenerator]);

  const graticulePath = useMemo(() => {
    if (!geoGenerator) {
      return "";
    }

    const graticule = d3Geo.geoGraticule();
    return geoGenerator(graticule()) || "";
  }, [geoGenerator]);

  const hotspots = useMemo(
    () => [...conflicts].sort((a, b) => b.impactScore - a.impactScore).slice(0, 12),
    [conflicts],
  );

  const projectedHotspots = useMemo(() => {
    if (!projection) {
      return [];
    }

    return hotspots
      .map((conflict) => {
        const [lng, lat] = [conflict.coordinates[1], conflict.coordinates[0]];
        const point = projection([lng, lat]);

        if (!point) {
          return null;
        }

        return {
          conflict,
          x: point[0],
          y: point[1],
          color: MAP_RISK_COLORS[conflict.intensity],
          radius: 4 + Math.floor(conflict.impactScore / 25),
          isSelected: selectedId === conflict.id,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  }, [hotspots, projection, selectedId]);

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
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_12%_14%,hsl(194_90%_64%_/_0.08),transparent_40%),radial-gradient(circle_at_84%_14%,hsl(38_100%_58%_/_0.08),transparent_36%)]" />

      <div className="relative z-10 border-b border-border/70 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="eyebrow text-[hsl(38_90%_64%)]">Global Intelligence</div>
            <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground md:text-2xl">
              Live Global Risk Map
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Real-time geopolitical conflict monitoring, regional threat assessment, and severity-based intelligence overlay.
            </p>
          </div>
          <div className="live-chip mt-1">
            <span className="pulse-dot" />
            Real-time
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-5">
        <div className="relative overflow-hidden rounded-2xl border border-border/75 bg-[linear-gradient(145deg,hsl(219_46%_8%),hsl(223_62%_4.5%))]">
          <svg
            viewBox="0 0 960 500"
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            style={{ minHeight: "380px" }}
          >
            <defs>
            </defs>

            <rect width="960" height="500" fill="hsl(219 50% 10%)" />

            {graticulePath && (
              <g className="graticule" opacity="0.6">
                <path
                  d={graticulePath}
                  fill="none"
                  stroke="hsl(195 100% 65%)"
                  strokeWidth="0.4"
                  opacity="0.08"
                />
              </g>
            )}

            <g className="country-paths">
              {countryPaths.map((country) => (
                <path
                  key={country.id}
                  d={country.d}
                  fill="hsl(203 45% 38%)"
                  stroke="hsl(195 100% 65%)"
                  strokeWidth="0.6"
                  opacity="0.8"
                />
              ))}
            </g>

            <g className="hotspots">
              {projectedHotspots.map((entry) => (
                <g
                  key={entry.conflict.id}
                  transform={`translate(${entry.x} ${entry.y})`}
                  className="cursor-pointer"
                  onClick={() => onSelect(entry.conflict)}
                >
                  <circle
                    r={entry.radius + 2}
                    fill={entry.color}
                    opacity="0.26"
                    className="map-hotspot-pulse"
                  />
                  <circle r={entry.radius} fill={entry.color} stroke="hsl(222 62% 4%)" strokeWidth="0.8" />
                  <circle r="1.2" fill="white" opacity="0.9" />

                  {entry.isSelected && (
                    <circle
                      r={entry.radius + 6}
                      fill="none"
                      stroke={entry.color}
                      strokeWidth="0.8"
                      strokeDasharray="3 2"
                      opacity="0.9"
                    />
                  )}
                </g>
              ))}
            </g>
          </svg>

          <div className="absolute left-3 top-3 z-20 rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[10px] text-foreground/70 backdrop-blur">
            Web Mercator · Real-time Overlay
          </div>

          <RiskLegend className="absolute bottom-3 right-3 z-20" />
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
              <div
                className="mt-0.5 font-mono text-sm font-semibold"
                style={{ color: MAP_RISK_COLORS[level] }}
              >
                {counts[level]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});
