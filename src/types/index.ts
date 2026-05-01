export type RiskLevel = "low" | "moderate" | "elevated" | "high" | "critical";
export type ConflictType = "interstate war" | "civil war" | "insurgency" | "regional instability" | "shipping crisis";
export type ImpactCategory = "energy" | "currency" | "crypto" | "trade" | "humanitarian";
export type FeedSource = "GDELT" | "ReliefWeb" | "ACLED" | "Wire" | "Analyst";
export type FeedSourceType = "event database" | "humanitarian desk" | "wire service" | "analyst desk";
export type FeedImpactCategory = ImpactCategory | "security" | "policy";
export type MarketCategory = "energy" | "metals" | "crypto" | "fx";
export type MarketKind = "commodity" | "digital asset" | "currency index" | "fx pair";
export type AidCategory =
  | "Medical Aid"
  | "Food Security"
  | "Shelter"
  | "Civilian Evacuation Support"
  | "Infrastructure Recovery";

export interface Conflict {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  startDate: string; // ISO
  type: ConflictType;
  intensity: RiskLevel;
  impactCategories: ImpactCategory[];
  summary: string;
  latestUpdate: string;
  impactScore: number; // 0-100
  scoreBreakdown: {
    intensity: number;
    activity: number;
    humanitarian: number;
    energy: number;
    trade: number;
    currency: number;
    market: number;
    economic: number;
  };
  keyActors: string[];
  timeline: { date: string; event: string }[];
  humanitarianImpact: { displaced: string; affected: string; note: string };
  marketImpact: string;
  relatedAssets: string[];
}

export interface FeedItem {
  id: string;
  source: FeedSource;
  sourceType: FeedSourceType;
  region: string;
  timestamp: string;
  severity: RiskLevel;
  impactCategory: FeedImpactCategory;
  headline: string;
  summary: string;
  conflictId?: string;
  relatedConflict?: string;
  isPinned?: boolean;
  isNew?: boolean;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  kind: MarketKind;
  price: number;
  unit: string;
  change24h: number; // %
  riskLabel: RiskLevel;
  venue: string;
  correlationLabel: string;
  exposureLabel: string;
  series: { t: number; v: number }[];
  thesis: string;
}

export interface HistoricalWar {
  id: string;
  name: string;
  years: string;
  region: string;
  description: string;
  causes: string[];
  economicImpact: string;
  lessonsLearned: string[];
}

export interface Report {
  id: string;
  title: string;
  category: "Weekly" | "Markets" | "Energy" | "Currency" | "Executive" | "Timeline";
  updated: string;
  pages: number;
  summary: string;
  audience: string;
  status: "draft" | "ready" | "scheduled";
}

export interface ReliefCampaign {
  id: string;
  name: string;
  region: string;
  relatedConflict: string;
  aidCategory: AidCategory;
  urgency: RiskLevel;
  targetAmount: number;
  raisedAmount: number;
  contributors: number;
  lastUpdated: string;
  description: string;
}

export interface SimulatedFundingSummary {
  totalRaised: number;
  totalTarget: number;
  completionPct: number;
  activeCampaigns: number;
  highestUrgencyRegion: string;
}
