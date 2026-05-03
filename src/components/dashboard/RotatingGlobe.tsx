import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as d3Geo from "d3-geo";
import { feature } from "topojson-client";

const WORLD_DATA_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function RotatingGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef<number>(0);
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

    const projection = d3Geo.geoOrthographic()
      .fitSize([360, 360], { type: "Sphere" });

    const geoGenerator = d3Geo.geoPath().projection(projection);
    const svg = svgRef.current;

    const animate = () => {
      rotationRef.current += 0.05;
      projection.rotate([rotationRef.current, -30, 0]);

      const paths = svg.querySelectorAll(".country-path");
      paths.forEach((path, index) => {
        const d = geoGenerator(countries[index]);
        (path as SVGPathElement).setAttribute("d", d || "");
      });

      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [countries]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[260px] w-[260px] items-center justify-center sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 360 360"
        className="absolute inset-0 h-full w-full"
        style={{ filter: "drop-shadow(0 0 80px rgba(212, 168, 83, 0.12))" }}
      >
        <defs>
           {/* Premium warm gold highlight gradient */}
           <radialGradient id="globeGradient" cx="32%" cy="32%">
             <stop offset="0%" stopColor="hsl(42 92% 68%)" stopOpacity="0.32" />
             <stop offset="35%" stopColor="hsl(38 85% 48%)" stopOpacity="0.15" />
             <stop offset="100%" stopColor="hsl(220 65% 35%)" stopOpacity="0" />
           </radialGradient>
         
           {/* Deep ocean with warm undertones */}
           <radialGradient id="globeOcean">
             <stop offset="0%" stopColor="hsl(218 48% 22%)" />
             <stop offset="100%" stopColor="hsl(224 55% 16%)" />
           </radialGradient>
         
           {/* Outer glow with warm amber rim lighting */}
           <radialGradient id="globeRimLight" cx="50%" cy="50%">
             <stop offset="70%" stopColor="hsl(42 88% 62% / 0.0)" />
             <stop offset="85%" stopColor="hsl(40 86% 56% / 0.08)" />
             <stop offset="100%" stopColor="hsl(38 84% 50% / 0.12)" />
           </radialGradient>
         
          <filter id="globeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="180" cy="180" r="178" fill="url(#globeOcean)" strokeWidth="0" />

        <circle cx="180" cy="180" r="178" fill="url(#globeGradient)" strokeWidth="0" />

         {/* Countries with warm earth tones */}
         <g className="countries">
          {countries?.map((country, idx) => {
            const geoGenerator = d3Geo.geoPath().projection(
              d3Geo.geoOrthographic().fitSize([360, 360], { type: "Sphere" }),
            );
            const pathData = geoGenerator(country) || "";
            return (
              <path
                key={idx}
                className="country-path"
                d={pathData}
                 fill="hsl(210 32% 38%)"
                 stroke="hsl(39 88% 62%)"
                 strokeWidth="0.6"
                 opacity="0.88"
                filter="url(#globeGlow)"
              />
            );
          })}
        </g>

         {/* Outer rim lighting for depth */}
         <circle cx="180" cy="180" r="178" fill="url(#globeRimLight)" strokeWidth="0" />

         {/* Subtle equatorial line */}
         <circle
           cx="180"
           cy="180"
           r="178"
           fill="none"
           stroke="hsl(39 84% 60%)"
           strokeWidth="0.8"
           opacity="0.18"
         />
      </svg>

      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
           boxShadow:
             "0 0 0 2px hsl(39 88% 62% / 0.28), 0 0 56px -4px hsl(40 88% 60% / 0.24), inset 0 0 68px hsl(38 100% 60% / 0.12)",
        }}
      />

       <motion.div
         className="absolute -inset-8 rounded-full border border-[hsl(39_88%_62%_/_0.22)]"
         animate={{ rotate: 360 }}
         transition={{ duration: 140, ease: "linear", repeat: Infinity }}
       />

       <motion.div
         className="absolute -inset-12 rounded-full border border-dashed border-[hsl(210_68%_48%_/_0.15)]"
         animate={{ rotate: -360 }}
         transition={{ duration: 200, ease: "linear", repeat: Infinity }}
      />

      <div className="absolute -bottom-8 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-full bg-black/40 blur-lg" />
    </div>
  );
}
