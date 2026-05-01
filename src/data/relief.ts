import type { ReliefCampaign, SimulatedFundingSummary } from "@/types";

export const reliefCampaigns: ReliefCampaign[] = [
  {
    id: "rf-ukr-medical-corridor",
    name: "Emergency Trauma Supply Corridor",
    region: "Eastern Europe",
    relatedConflict: "Russia-Ukraine War",
    aidCategory: "Medical Aid",
    urgency: "critical",
    targetAmount: 2400000,
    raisedAmount: 1565000,
    contributors: 4180,
    lastUpdated: "12m ago",
    description:
      "Supports verified field clinics with trauma kits, blood-chain logistics, and mobile stabilization capacity.",
  },
  {
    id: "rf-gaza-shelter-grid",
    name: "Urban Shelter Grid Stabilization",
    region: "Levant",
    relatedConflict: "Israel-Hamas War",
    aidCategory: "Shelter",
    urgency: "critical",
    targetAmount: 3100000,
    raisedAmount: 2075000,
    contributors: 5360,
    lastUpdated: "8m ago",
    description:
      "Maintains temporary shelter density, winterization kits, and safe-site infrastructure in high-pressure urban zones.",
  },
  {
    id: "rf-sudan-food-bridge",
    name: "Regional Food Bridge",
    region: "North-East Africa",
    relatedConflict: "Sudan Conflict",
    aidCategory: "Food Security",
    urgency: "high",
    targetAmount: 1980000,
    raisedAmount: 1112000,
    contributors: 2920,
    lastUpdated: "24m ago",
    description:
      "Coordinates staple rations, child nutrition packs, and cross-border convoy sequencing with local partners.",
  },
  {
    id: "rf-red-sea-evac-support",
    name: "Maritime Civilian Evacuation Support",
    region: "Red Sea Corridor",
    relatedConflict: "Red Sea Shipping Crisis",
    aidCategory: "Civilian Evacuation Support",
    urgency: "high",
    targetAmount: 1450000,
    raisedAmount: 845000,
    contributors: 1880,
    lastUpdated: "31m ago",
    description:
      "Provides transport staging, processing support, and temporary reception logistics for displaced civilians.",
  },
  {
    id: "rf-sahel-clinic-network",
    name: "Sahel Community Clinic Network",
    region: "West Africa",
    relatedConflict: "Sahel Regional Instability",
    aidCategory: "Medical Aid",
    urgency: "elevated",
    targetAmount: 1320000,
    raisedAmount: 702000,
    contributors: 1425,
    lastUpdated: "42m ago",
    description:
      "Expands rotating clinic teams, pharmaceuticals, and maternal care access in remote and transit communities.",
  },
  {
    id: "rf-kharkiv-grid-repair",
    name: "Critical Utility Restoration Window",
    region: "Eastern Europe",
    relatedConflict: "Russia-Ukraine War",
    aidCategory: "Infrastructure Recovery",
    urgency: "moderate",
    targetAmount: 970000,
    raisedAmount: 516000,
    contributors: 960,
    lastUpdated: "1h ago",
    description:
      "Restores power, water, and heating nodes for high-density civilian districts before peak seasonal demand.",
  },
];

const totalTarget = reliefCampaigns.reduce((sum, campaign) => sum + campaign.targetAmount, 0);
const totalRaised = reliefCampaigns.reduce((sum, campaign) => sum + campaign.raisedAmount, 0);

export const simulatedFundingSummary: SimulatedFundingSummary = {
  totalRaised,
  totalTarget,
  completionPct: Math.round((totalRaised / totalTarget) * 100),
  activeCampaigns: reliefCampaigns.length,
  highestUrgencyRegion: "Eastern Europe",
};
