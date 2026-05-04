import { memo, useEffect, useMemo, useState } from "react";
import * as d3Geo from "d3-geo";
import { loadWorldCountries } from "@/lib/worldAtlas";

export const RotatingGlobe = memo(function RotatingGlobe() {
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

  const countryPaths = useMemo(() => {
    if (!countries) {
      return [];
    }

    const projection = d3Geo.geoOrthographic().fitSize([360, 360], { type: "Sphere" });
    const geoGenerator = d3Geo.geoPath().projection(projection);

    return countries
      .map((country, idx) => ({
        id: `globe-country-${idx}`,
        d: geoGenerator(country) || "",
      }))
      .filter((entry) => entry.d);
  }, [countries]);

  return (
    <div className="relative flex h-[260px] w-[260px] items-center justify-center sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]">
      <svg
        viewBox="0 0 360 360"
        className="absolute inset-0 h-full w-full"
        style={{ filter: "drop-shadow(0 0 44px rgba(212, 168, 83, 0.12))" }}
      >
        <defs>
          <radialGradient id="globeGradient" cx="32%" cy="32%">
            <stop offset="0%" stopColor="hsl(42 92% 68%)" stopOpacity="0.32" />
            <stop offset="35%" stopColor="hsl(38 85% 48%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(220 65% 35%)" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="globeOcean">
            <stop offset="0%" stopColor="hsl(218 48% 22%)" />
            <stop offset="100%" stopColor="hsl(224 55% 16%)" />
          </radialGradient>

          <radialGradient id="globeRimLight" cx="50%" cy="50%">
            <stop offset="70%" stopColor="hsl(42 88% 62% / 0.0)" />
            <stop offset="85%" stopColor="hsl(40 86% 56% / 0.08)" />
            <stop offset="100%" stopColor="hsl(38 84% 50% / 0.12)" />
          </radialGradient>

          <clipPath id="globeClip">
            <circle cx="180" cy="180" r="178" />
          </clipPath>
        </defs>

        <circle cx="180" cy="180" r="178" fill="url(#globeOcean)" strokeWidth="0" />

        <circle cx="180" cy="180" r="178" fill="url(#globeGradient)" strokeWidth="0" />

        <g className="globe-rotation" clipPath="url(#globeClip)">
          {countryPaths.map((country) => (
            <path
              key={country.id}
              d={country.d}
              fill="hsl(210 32% 38%)"
              stroke="hsl(39 88% 62% / 0.82)"
              strokeWidth="0.58"
              opacity="0.88"
            />
          ))}
        </g>

        <circle cx="180" cy="180" r="178" fill="url(#globeRimLight)" strokeWidth="0" />

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

      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 0 2px hsl(39 88% 62% / 0.28), 0 0 42px -6px hsl(40 88% 60% / 0.22), inset 0 0 52px hsl(38 100% 60% / 0.1)",
        }}
      />

      <div className="orbit-ring orbit-ring-outer absolute -inset-8 rounded-full border border-[hsl(39_88%_62%_/_0.22)]" />

      <div
        className="orbit-ring orbit-ring-inner absolute -inset-12 rounded-full border border-dashed border-[hsl(210_68%_48%_/_0.15)]"
      />

      <div className="absolute -bottom-8 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-full bg-black/40 blur-lg" />
    </div>
  );
});
