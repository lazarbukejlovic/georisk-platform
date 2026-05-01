import { Outlet } from "react-router-dom";
import { IconRail } from "./IconRail";
import { CommandBar } from "./CommandBar";
import { MarketTicker } from "./MarketTicker";

export default function AppLayout() {
  return (
    <div className="intel-shell min-h-screen flex w-full bg-background text-foreground">
      <IconRail />
      <div className="relative flex-1 flex flex-col min-w-0">
        {/* Atmospheric depth glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-6%] h-[32rem] w-[32rem] rounded-full opacity-35 blur-[80px]"
               style={{ background: "var(--gradient-glow-cyan)" }} />
          <div className="absolute right-[-6%] top-[12%] h-[28rem] w-[28rem] rounded-full opacity-25 blur-[80px]"
               style={{ background: "var(--gradient-glow-red)" }} />
          <div className="absolute left-[26%] top-[8%] h-[24rem] w-[24rem] rounded-full opacity-25 blur-[74px]"
            style={{ background: "var(--gradient-glow-teal)" }} />
          <div className="absolute left-[45%] bottom-[5%] h-[20rem] w-[20rem] rounded-full opacity-20 blur-[70px]"
               style={{ background: "var(--gradient-glow-amber)" }} />
        </div>
        <CommandBar />
        <main className="relative z-10 flex-1 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
        <MarketTicker />
      </div>
    </div>
  );
}
