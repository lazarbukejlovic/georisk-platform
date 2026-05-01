import type { RiskLevel } from "@/types";

export const riskMeta: Record<RiskLevel, { label: string; token: string; bg: string; text: string; border: string }> = {
  low:       { label: "Low",       token: "low",       bg: "bg-risk-low/10",       text: "text-risk-low",       border: "border-risk-low/30" },
  moderate:  { label: "Moderate",  token: "moderate",  bg: "bg-risk-moderate/10",  text: "text-risk-moderate",  border: "border-risk-moderate/30" },
  elevated:  { label: "Elevated",  token: "elevated",  bg: "bg-risk-elevated/10",  text: "text-risk-elevated",  border: "border-risk-elevated/30" },
  high:      { label: "High",      token: "high",      bg: "bg-risk-high/10",      text: "text-risk-high",      border: "border-risk-high/30" },
  critical:  { label: "Critical",  token: "critical",  bg: "bg-risk-critical/10",  text: "text-risk-critical",  border: "border-risk-critical/30" },
};

export const scoreToRisk = (score: number): RiskLevel => {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 55) return "elevated";
  if (score >= 35) return "moderate";
  return "low";
};

export const formatTimeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};
