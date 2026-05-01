import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { reliefCampaigns, simulatedFundingSummary } from "@/data/relief";
import { riskMeta } from "@/lib/risk";
import type { ReliefCampaign, RiskLevel } from "@/types";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeartHandshake, Activity, BadgeDollarSign, ShieldCheck, AlertTriangle, Clock3, Users } from "lucide-react";

const urgencyOrder: Record<RiskLevel, number> = {
  critical: 5,
  high: 4,
  elevated: 3,
  moderate: 2,
  low: 1,
};

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function ReliefTrackerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(reliefCampaigns[0].id);
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [demoRaisedByCampaign, setDemoRaisedByCampaign] = useState<Record<string, number>>({});
  const [demoContributorsByCampaign, setDemoContributorsByCampaign] = useState<Record<string, number>>({});

  const campaigns = useMemo(() => {
    return reliefCampaigns.map((campaign) => {
      const extraRaised = demoRaisedByCampaign[campaign.id] ?? 0;
      const extraContributors = demoContributorsByCampaign[campaign.id] ?? 0;
      const raisedAmount = Math.min(campaign.targetAmount, campaign.raisedAmount + extraRaised);
      const contributors = campaign.contributors + extraContributors;
      const progress = Math.round((raisedAmount / campaign.targetAmount) * 100);
      return { ...campaign, raisedAmount, contributors, progress };
    });
  }, [demoRaisedByCampaign, demoContributorsByCampaign]);

  const summary = useMemo(() => {
    const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raisedAmount, 0);
    const totalTarget = campaigns.reduce((sum, campaign) => sum + campaign.targetAmount, 0);
    const completionPct = Math.round((totalRaised / totalTarget) * 100);
    const highestUrgency = [...campaigns].sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency])[0];

    return {
      ...simulatedFundingSummary,
      totalRaised,
      totalTarget,
      completionPct,
      activeCampaigns: campaigns.length,
      highestUrgencyRegion: highestUrgency.region,
    };
  }, [campaigns]);

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? campaigns[0];

  const openContributionModal = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedAmount(25);
    setCustomAmount("");
    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const resolveContributionAmount = () => {
    if (selectedAmount === -1) {
      const parsed = Number(customAmount);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }
    return selectedAmount;
  };

  const confirmDemoContribution = () => {
    const amount = resolveContributionAmount();
    if (amount <= 0) return;

    setDemoRaisedByCampaign((current) => ({
      ...current,
      [selectedCampaign.id]: (current[selectedCampaign.id] ?? 0) + amount,
    }));

    setDemoContributorsByCampaign((current) => ({
      ...current,
      [selectedCampaign.id]: (current[selectedCampaign.id] ?? 0) + 1,
    }));

    setIsSuccess(true);
  };

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-[1680px] mx-auto space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-atmosphere panel p-5 md:p-6"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">Humanitarian Intelligence</div>
            <h1 className="hero-title mt-2">Humanitarian Relief Tracker</h1>
            <p className="section-copy mt-2 max-w-3xl">
              Verified campaign monitoring aligned with conflict intelligence, designed for situational awareness and strategic planning.
            </p>
            <div className="mt-3 text-[10px] font-condensed font-semibold uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
              This is a simulated demo feature. No real funds are collected or processed.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[34rem]">
            <div className="panel-flat p-4">
              <div className="data-label">Simulated Funds Raised</div>
              <div className="value-stat text-2xl mt-1.5 text-primary">{formatUsd(summary.totalRaised)}</div>
            </div>
            <div className="panel-flat p-4">
              <div className="data-label">Funding Target</div>
              <div className="value-stat text-2xl mt-1.5">{formatUsd(summary.totalTarget)}</div>
            </div>
            <div className="panel-flat p-4">
              <div className="data-label">Completion</div>
              <div className="value-stat text-2xl mt-1.5">{summary.completionPct}%</div>
            </div>
            <div className="panel-flat p-4">
              <div className="data-label">Highest Urgency Region</div>
              <div className="font-display text-[15px] font-semibold mt-1.5 leading-tight">{summary.highestUrgencyRegion}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 panel-flat p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="panel-heading">Live Funding Scale</div>
            <div className="status-chip">
              <Activity className="h-3 w-3 text-primary" /> {summary.activeCampaigns} active campaigns
            </div>
          </div>
          <div className="relative">
            <Progress value={summary.completionPct} className="h-3 bg-secondary/70" />
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-primary/35 to-transparent"
              animate={{ x: ["-22%", "112%"] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-condensed font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <span>{formatUsd(summary.totalRaised)} raised</span>
            <span>{formatUsd(summary.totalTarget)} target</span>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 space-y-4">
          <div className="panel-heading px-0.5">Relief Campaigns</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {campaigns.map((campaign) => {
              const urgencyMeta = riskMeta[campaign.urgency];
              const isUrgent = campaign.urgency === "critical" || campaign.urgency === "high";
              return (
                <article
                  key={campaign.id}
                  className={cn(
                    "panel p-4 relative overflow-hidden",
                    isUrgent && "shadow-[0_0_0_1px_hsl(var(--risk-high)/0.24),0_0_40px_-26px_hsl(var(--risk-high)/0.55)]"
                  )}
                >
                  {isUrgent && (
                    <motion.div
                      className="pointer-events-none absolute -right-12 -top-10 h-36 w-36 rounded-full"
                      style={{ background: "radial-gradient(circle, hsl(var(--risk-high)/0.18), transparent 70%)" }}
                      animate={{ opacity: [0.55, 1, 0.55], scale: [0.96, 1.06, 0.96] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="eyebrow">{campaign.aidCategory}</div>
                      <h3 className="font-display text-[16px] font-semibold tracking-[-0.02em] leading-tight mt-1">{campaign.name}</h3>
                    </div>
                    <span className={cn("status-chip", urgencyMeta.text, urgencyMeta.border, urgencyMeta.bg)}>
                      <AlertTriangle className="h-3 w-3" /> {urgencyMeta.label}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-y-2 text-[10px] font-condensed font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <div>Region: <span className="text-foreground/90">{campaign.region}</span></div>
                    <div>Conflict: <span className="text-foreground/90">{campaign.relatedConflict}</span></div>
                  </div>

                  <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">{campaign.description}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] font-condensed font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
                      <span>Funding Progress</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <Progress value={campaign.progress} className="h-2.5 bg-secondary/70" />
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>{formatUsd(campaign.raisedAmount)}</span>
                      <span>{formatUsd(campaign.targetAmount)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-condensed uppercase tracking-[0.1em] text-muted-foreground">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        {campaign.contributors.toLocaleString()} contributors
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-condensed uppercase tracking-[0.1em] text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {campaign.lastUpdated}
                      </div>
                    </div>
                    <Button className="h-8 text-[10px] font-condensed font-semibold uppercase tracking-[0.12em]" onClick={() => openContributionModal(campaign.id)}>
                      <BadgeDollarSign className="h-3.5 w-3.5 mr-1" /> Demo contribution
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="col-span-12 xl:col-span-4 space-y-4">
          <div className="panel p-4">
            <div className="panel-heading">Humanitarian Impact Summary</div>
            <ul className="mt-3 space-y-2">
              <li className="data-strip rounded-lg border border-border/60">
                <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center text-primary">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium">Campaigns under monitoring</div>
                  <div className="meta-text mt-0.5">{summary.activeCampaigns} active nodes</div>
                </div>
              </li>
              <li className="data-strip rounded-lg border border-border/60">
                <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/30 grid place-items-center text-accent">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium">Tracking mode</div>
                  <div className="meta-text mt-0.5">Simulated contribution environment</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="panel p-4">
            <div className="panel-heading">Transparency Notice</div>
            <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
              This is a simulated demo feature. No real funds are collected or processed.
            </p>
            <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
              Campaign records and funding values are mock data designed to demonstrate future workflow integration.
            </p>
          </div>
        </aside>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="panel max-w-[520px] border-border/80">
          <DialogHeader>
            <DialogTitle className="font-display text-[22px] tracking-[-0.02em]">Demo Contribution</DialogTitle>
            <DialogDescription className="text-[13px] leading-relaxed">
              Select a simulated amount for <span className="text-foreground font-medium">{selectedCampaign.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {!isSuccess && (
            <>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                    className={cn(
                      "h-10 rounded-lg border text-[12px] font-condensed font-semibold uppercase tracking-[0.12em] transition-colors",
                      selectedAmount === amount
                        ? "border-primary/45 bg-primary/12 text-primary"
                        : "border-border bg-secondary/40 text-foreground/80 hover:bg-secondary/60"
                    )}
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedAmount(-1)}
                  className={cn(
                    "h-10 rounded-lg border text-[12px] font-condensed font-semibold uppercase tracking-[0.12em] transition-colors",
                    selectedAmount === -1
                      ? "border-primary/45 bg-primary/12 text-primary"
                      : "border-border bg-secondary/40 text-foreground/80 hover:bg-secondary/60"
                  )}
                >
                  Custom
                </button>
              </div>

              {selectedAmount === -1 && (
                <Input
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value.replace(/[^\d.]/g, ""))}
                  placeholder="Enter custom amount"
                  className="h-10 bg-secondary/40 border-border/70"
                />
              )}

              <div className="rounded-lg border border-[hsl(var(--accent)/0.35)] bg-[hsl(var(--accent)/0.08)] px-3 py-2 text-[11px] font-medium text-foreground/85">
                This is a simulated demo feature. No real funds are collected or processed.
              </div>
            </>
          )}

          {isSuccess && (
            <div className="rounded-lg border border-[hsl(var(--positive)/0.3)] bg-[hsl(var(--positive)/0.08)] px-3 py-3 text-[13px] text-foreground/90 leading-relaxed">
              Demo contribution recorded — no real payment was processed.
            </div>
          )}

          <DialogFooter>
            {!isSuccess ? (
              <Button
                onClick={confirmDemoContribution}
                className="text-[11px] font-condensed font-semibold uppercase tracking-[0.12em]"
                disabled={resolveContributionAmount() <= 0}
              >
                Confirm Demo Contribution
              </Button>
            ) : (
              <Button onClick={() => setIsModalOpen(false)} className="text-[11px] font-condensed font-semibold uppercase tracking-[0.12em]">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
