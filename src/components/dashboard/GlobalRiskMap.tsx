import { useEffect, useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import * as d3Geo from "d3-geo";
import { feature } from "topojson-client";
import type { Conflict, RiskLevel } from "@/types";
import { MAP_RISK_COLORS, RiskLegend } from "@/components/dashboard/RiskLegend";
import { cn } from "@/lib/utils";

const WORLD_DATA_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const levelOrder: RiskLevel[] = ["critical", "high", "elevated", "moderate", "low"];

interface GlobalRiskMapProps {
  conflicts: Conflict[];
  selectedId?: string | null;
  onSelect: (conflict: Conflict) => void;
}

export function GlobalRiskMap({
  conflicts,
  selectedId,
  onSelect,
}: GlobalRiskMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [countries, setCountries] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(WORLD_DATA_URL);
        const topology = await response.json();
        const countriesData = feature(topology, topology.objects.countries).features;
        setCountries(countriesData);
      } catch (error) {
        console.error("Failed to load world data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !countries) return;
    renderMap(countries, svgRef.current);
  }, [countries]);

  const hotspots = useMemo(
    () => [...conflicts].sort((a, b) => b.impactScore - a.impactScore).slice(0, 12),
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

  const renderMap = (countriesData: any, svg: SVGSVGElement) => {
    const width = 960;
    const height = 500;

    const projection = d3Geo.geoMercator().fitSize([width, height], {
      type: "Sphere",
    });

    const geoGenerator = d3Geo.geoPath().projection(projection);

    const pathGroup = svg.querySelector(".country-paths");
    if (pathGroup) {
      pathGroup.innerHTML = "";

      countriesData.forEach((country: any, idx: number) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", geoGenerator(country) || "");
        path.setAttribute("fill", "hsl(203 45% 38%)");
        path.setAttribute("stroke", "hsl(195 100% 65%)");
        path.setAttribute("stroke-width", "0.6");
        path.setAttribute("opacity", "0.8");
        path.classList.add("country");
        pathGroup.appendChild(path);
      });
    }

    const graticule = d3Geo.geoGraticule();
    const graticuleGroup = svg.querySelector(".graticule");
    if (graticuleGroup) {
      const gratPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      gratPath.setAttribute("d", geoGenerator(graticule()) || "");
      gratPath.setAttribute("fill", "none");
      gratPath.setAttribute("stroke", "hsl(195 100% 65%)");
      gratPath.setAttribute("stroke-width", "0.4");
      gratPath.setAttribute("opacity", "0.08");
      graticuleGroup.appendChild(gratPath);
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const hotspotGroup = svgRef.current.querySelector(".hotspots");
    if (hotspotGroup) {
      hotspotGroup.innerHTML = "";

      const projection = d3Geo.geoMercator().fitSize([960, 500], {
        type: "Sphere",
      });

      hotspots.forEach((conflict) => {
        const [lng, lat] = [conflict.coordinates[1], conflict.coordinates[0]];
        const [x, y] = projection([lng, lat]) || [0, 0];

        if (x !== 0 || y !== 0) {
          const color = MAP_RISK_COLORS[conflict.intensity];
          const radius = 4 + Math.floor(conflict.impactScore / 25);
          const isSelected = selectedId === conflict.id;

          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          g.setAttribute("transform", `translate(${x} ${y})`);
          g.setAttribute("class", "cursor-pointer");
          g.style.pointerEvents = "auto";

          const pulseCircle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          pulseCircle.setAttribute("r", String(radius + 2));
          pulseCircle.setAttribute("fill", color);
          pulseCircle.setAttribute("opacity", "0.3");
          pulseCircle.setAttribute("class", "pulse-circle");
          g.appendChild(pulseCircle);

          const mainCircle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          mainCircle.setAttribute("r", String(radius));
          mainCircle.setAttribute("fill", color);
          mainCircle.setAttribute("stroke", "hsl(222 62% 4%)");
          mainCircle.setAttribute("stroke-width", "0.8");
          g.appendChild(mainCircle);

          const innerCircle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          innerCircle.setAttribute("r", "1.2");
          innerCircle.setAttribute("fill", "white");
          innerCircle.setAttribute("opacity", "0.9");
          g.appendChild(innerCircle);

          if (isSelected) {
            const selectionRing = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "circle",
            );
            selectionRing.setAttribute("r", String(radius + 6));
            selectionRing.setAttribute("fill", "none");
            selectionRing.setAttribute("stroke", color);
            selectionRing.setAttribute("stroke-width", "0.8");
            selectionRing.setAttribute("stroke-dasharray", "3 2");
            selectionRing.setAttribute("opacity", "0.9");
            g.appendChild(selectionRing);
          }

          g.addEventListener("click", () => onSelect(conflict));
          g.addEventListener("mouseenter", () => {
            pulseCircle.style.animation =
              "mapPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite";
          });
          g.addEventListener("mouseleave", () => {
            pulseCircle.style.animation = "";
          });

          hotspotGroup.appendChild(g);
        }
      });
    }
  }, [hotspots, selectedId, onSelect]);

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
            ref={svgRef}
            viewBox="0 0 960 500"
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            style={{ minHeight: "380px" }}
          >
            <defs>
              <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <style>{`
                @keyframes mapPulse {
                  0% { r: attr(r); opacity: 0.3; }
                  50% { opacity: 0.6; }
                  100% { r: attr(r); opacity: 0.1; }
                }
              `}</style>
            </defs>

            <rect width="960" height="500" fill="hsl(219 50% 10%)" />

            <g className="graticule" opacity="0.6" />

            <g className="country-paths" />

            <g className="hotspots" />
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
}
