import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Globe2, Radio, LineChart, Library, FileText, Settings, Shield, BellRing, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/",         icon: LayoutDashboard, label: "Command" },
  { to: "/map",      icon: Globe2,          label: "Map" },
  { to: "/feed",     icon: Radio,           label: "Feed" },
  { to: "/markets",  icon: LineChart,       label: "Markets" },
  { to: "/history",  icon: Library,         label: "History" },
  { to: "/reports",  icon: FileText,        label: "Reports" },
  { to: "/relief",   icon: HeartHandshake,  label: "Relief Tracker" },
  { to: "/settings", icon: Settings,        label: "Settings" },
];

export function IconRail() {
  const { pathname } = useLocation();
  const active = (to: string) => to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <aside className="hidden md:flex flex-col items-center w-[68px] shrink-0 border-r border-sidebar-border bg-[hsl(var(--sidebar-background)/0.96)] backdrop-blur-2xl z-30">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-[68px] h-px bg-gradient-to-r from-primary/50 to-transparent" />

      {/* Logo */}
      <div className="h-14 w-full grid place-items-center border-b border-sidebar-border">
        <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary/90 to-primary/20 grid place-items-center shadow-[0_0_24px_hsl(var(--primary)/0.32),0_0_0_1px_hsl(var(--primary)/0.18)]">
          <Shield className="h-[18px] w-[18px] text-primary-foreground" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[hsl(var(--risk-critical))] blink shadow-[0_0_6px_hsl(var(--risk-critical))]" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-1.5 py-3">
        {items.map(({ to, icon: Icon, label }) => {
          const a = active(to);
          return (
            <NavLink
              key={to} to={to} end={to === "/"} title={label}
              className={cn(
                "group relative h-11 w-11 grid place-items-center rounded-xl transition-all duration-200",
                a
                  ? "text-primary bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.14),inset_0_1px_0_hsl(0_0%_100%/0.04)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {a && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-primary rounded-r shadow-[0_0_10px_hsl(var(--primary))]" />
              )}
              <Icon className={cn("transition-all duration-200", a ? "h-[17px] w-[17px]" : "h-[16px] w-[16px]")} />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-[56px] top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-popover border border-border text-[10px] font-condensed font-semibold uppercase tracking-[0.14em] text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="pb-3 flex flex-col items-center gap-2.5">
        <div className="relative h-10 w-10 grid place-items-center rounded-xl border border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-border cursor-pointer transition-colors">
          <BellRing className="h-3.5 w-3.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--risk-high))] blink shadow-[0_0_5px_hsl(var(--risk-high))]" />
        </div>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/65 to-primary/15 grid place-items-center text-[10px] font-bold text-primary-foreground border border-primary/35 shadow-[0_0_14px_hsl(var(--primary)/0.18)] cursor-pointer">
          AN
        </div>
      </div>
    </aside>
  );
}
