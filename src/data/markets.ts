import type { MarketAsset } from "@/types";

const series = (base: number, drift: number, n = 24, vol = 0.015) => {
  let v = base;
  const out: { t: number; v: number }[] = [];
  for (let i = 0; i < n; i++) {
    v = v * (1 + (Math.sin(i / 2 + base) * vol) + drift / n);
    out.push({ t: i, v: +v.toFixed(2) });
  }
  return out;
};

export const marketAssets: MarketAsset[] = [
  { id: "brent", symbol: "BRENT", name: "Brent Crude", category: "energy", kind: "commodity", price: 84.62, unit: "USD/bbl", change24h: 1.42, riskLabel: "high", venue: "ICE", correlationLabel: "Energy shock beta", exposureLabel: "MENA + Red Sea", series: series(82, 0.03), thesis: "Conflict risk across producing regions and maritime chokepoints continues to sustain the geopolitical premium in seaborne crude." },
  { id: "wti", symbol: "WTI", name: "WTI Crude", category: "energy", kind: "commodity", price: 80.18, unit: "USD/bbl", change24h: 1.18, riskLabel: "elevated", venue: "NYMEX", correlationLabel: "Spread follower", exposureLabel: "Atlantic basin", series: series(78, 0.025), thesis: "WTI tracks Brent-led repricing with a smaller geopolitical premium thanks to domestic US supply insulation." },
  { id: "gold", symbol: "XAU", name: "Gold", category: "metals", kind: "commodity", price: 2382.4, unit: "USD/oz", change24h: 0.62, riskLabel: "elevated", venue: "LBMA", correlationLabel: "Risk-off hedge", exposureLabel: "Safe-haven flows", series: series(2350, 0.015), thesis: "Gold remains the cleanest hedge for escalation episodes that combine inflation anxiety with geopolitical uncertainty." },
  { id: "btc", symbol: "BTC", name: "Bitcoin", category: "crypto", kind: "digital asset", price: 64210, unit: "USD", change24h: -2.10, riskLabel: "high", venue: "Global spot", correlationLabel: "High volatility beta", exposureLabel: "Liquidity-sensitive", series: series(65000, -0.02, 24, 0.025), thesis: "Bitcoin behaves like a high-beta macro asset in acute risk-off episodes before longer-cycle narratives reassert themselves." },
  { id: "eth", symbol: "ETH", name: "Ethereum", category: "crypto", kind: "digital asset", price: 3142, unit: "USD", change24h: -1.78, riskLabel: "high", venue: "Global spot", correlationLabel: "Beta to BTC", exposureLabel: "Cross-asset risk", series: series(3200, -0.018, 24, 0.028), thesis: "Ethereum tends to amplify broader crypto repricing during geopolitical volatility and tighter macro liquidity." },
  { id: "usd", symbol: "USD", name: "US Dollar Index", category: "fx", kind: "currency index", price: 104.85, unit: "Index", change24h: 0.34, riskLabel: "moderate", venue: "DXY basket", correlationLabel: "Reserve safe-haven", exposureLabel: "Global risk-off", series: series(104.5, 0.005, 24, 0.004), thesis: "Dollar strength typically resumes when geopolitical stress combines with tighter financial conditions and demand for reserve liquidity." },
  { id: "eur", symbol: "EUR", name: "Euro / US Dollar", category: "fx", kind: "fx pair", price: 1.0742, unit: "USD", change24h: -0.21, riskLabel: "elevated", venue: "Spot FX", correlationLabel: "Energy-sensitive G10", exposureLabel: "Europe spillover", series: series(1.078, -0.005, 24, 0.003), thesis: "EUR remains sensitive to conflict-driven energy security risks and trade confidence across Europe." },
  { id: "gbp", symbol: "GBP", name: "Sterling / US Dollar", category: "fx", kind: "fx pair", price: 1.2685, unit: "USD", change24h: -0.12, riskLabel: "moderate", venue: "Spot FX", correlationLabel: "Moderate G10 beta", exposureLabel: "Policy-sensitive", series: series(1.27, -0.003, 24, 0.0035), thesis: "Sterling follows broader European sentiment but remains somewhat cushioned by domestic policy and North Sea exposure." },
  { id: "chf", symbol: "CHF", name: "Swiss Franc / US Dollar", category: "fx", kind: "fx pair", price: 1.1218, unit: "USD", change24h: 0.28, riskLabel: "low", venue: "Spot FX", correlationLabel: "Defensive G10", exposureLabel: "Safe-haven demand", series: series(1.12, 0.004, 24, 0.0025), thesis: "CHF remains a stable refuge for cross-border capital when escalation risk broadens beyond a single theatre." },
  { id: "sgd", symbol: "SGD", name: "Singapore Dollar / US Dollar", category: "fx", kind: "fx pair", price: 0.7402, unit: "USD", change24h: 0.05, riskLabel: "low", venue: "Spot FX", correlationLabel: "Asia defensive proxy", exposureLabel: "Trade corridor risk", series: series(0.74, 0.001, 24, 0.002), thesis: "SGD acts as a regional stability proxy when Asian trade routes remain functional despite broader geopolitical noise." },
];
