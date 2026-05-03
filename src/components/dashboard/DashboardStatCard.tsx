import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  detail: string;
  accent: string;
  index?: number;
}

export function DashboardStatCard({
  icon: Icon,
  label,
  value,
  detail,
  accent,
  index = 0,
}: DashboardStatCardProps) {
  return (
    <motion.article
      className="panel-flat group relative overflow-hidden rounded-2xl border border-border/75 bg-[linear-gradient(150deg,hsl(220_35%_8.5%),hsl(223_42%_5.3%))] p-4 transition-all duration-200 md:p-5"
      whileHover={{ y: -3, borderColor: "hsl(193 88% 67% / 0.25)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ transitionDelay: `${index * 45}ms` }}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(193_88%_67%_/_0.04),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-[9px] font-condensed font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-2.5 font-display text-2xl font-bold tracking-[-0.02em] text-foreground md:text-3xl">
            {value}
          </div>
        </div>
        <div className={cn(
          "rounded-xl border border-white/12 bg-white/5 p-2.5 transition-all duration-200 group-hover:bg-white/8 group-hover:border-white/20",
          "flex items-center justify-center"
        )}>
          <Icon className={cn("h-5 w-5 transition-all duration-200", accent)} />
        </div>
      </div>
      <p className="relative z-10 mt-3 text-xs leading-5 text-foreground/66">{detail}</p>
    </motion.article>
  );
}
