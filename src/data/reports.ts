import type { Report } from "@/types";

export const reports: Report[] = [
  { id: "r1", title: "Weekly Geopolitical Risk Summary", category: "Weekly", updated: "2h ago", pages: 14,
    summary: "Cross-region update covering active conflicts, escalation indicators, and key watch items for the week ahead.", audience: "Executive desk", status: "ready" },
  { id: "r2", title: "Market Exposure Report", category: "Markets", updated: "6h ago", pages: 22,
    summary: "Conflict-linked exposures across energy, FX, metals, and crypto with rationale and risk labels.", audience: "Markets desk", status: "ready" },
  { id: "r3", title: "Energy Risk Brief", category: "Energy", updated: "1d ago", pages: 9,
    summary: "Brent and gas-market sensitivities to active Middle East and Red Sea developments.", audience: "Energy desk", status: "scheduled" },
  { id: "r4", title: "Currency Pressure Brief", category: "Currency", updated: "1d ago", pages: 7,
    summary: "Safe-haven flows, EM currency stress, and central-bank policy implications under current risk regimes.", audience: "Macro desk", status: "draft" },
  { id: "r5", title: "Conflict Timeline Export", category: "Timeline", updated: "3d ago", pages: 5,
    summary: "Exportable timeline of major events across the active conflict portfolio for the trailing 30 days.", audience: "Client delivery", status: "ready" },
  { id: "r6", title: "Executive Exposure Brief", category: "Executive", updated: "4h ago", pages: 11,
    summary: "Board-ready summary of critical theatres, market spillover, and watchlist changes across the next seven days.", audience: "Leadership", status: "ready" },
];
