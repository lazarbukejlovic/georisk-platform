import { feature } from "topojson-client";

const WORLD_DATA_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

let countriesCache: any[] | null = null;
let countriesPromise: Promise<any[]> | null = null;

export async function loadWorldCountries(): Promise<any[]> {
  if (countriesCache) {
    return countriesCache;
  }

  if (!countriesPromise) {
    countriesPromise = fetch(WORLD_DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch world data: ${response.status}`);
        }

        return response.json();
      })
      .then((topology) => {
        const countriesData = feature(topology, topology.objects.countries).features;
        countriesCache = countriesData;
        return countriesData;
      });
  }

  return countriesPromise;
}
