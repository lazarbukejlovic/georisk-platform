import { motion } from "framer-motion";

const GLOBE_POINTS = [
  { x: "14%", y: "35%" },
  { x: "29%", y: "68%" },
  { x: "48%", y: "26%" },
  { x: "66%", y: "58%" },
  { x: "80%", y: "38%" },
  { x: "58%", y: "78%" },
];

export function HeroGlobe() {
  return (
    <div className="relative h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, hsl(202 82% 74% / 0.3), transparent 45%), radial-gradient(circle at 70% 68%, hsl(38 95% 57% / 0.28), transparent 48%), radial-gradient(circle at 50% 50%, hsl(214 50% 16%), hsl(221 58% 7%) 70%)",
          boxShadow:
            "0 0 0 1px hsl(193 62% 64% / 0.32), 0 0 45px -4px hsl(196 88% 66% / 0.24), 0 0 80px -10px hsl(36 96% 58% / 0.22)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 70, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute inset-[10%] rounded-full border border-primary/20" />
        <div className="absolute inset-[18%] rounded-full border border-[#4ca7ff]/25" />
        <div className="absolute inset-[28%] rounded-full border border-[#f5b84b]/20" />

        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={idx}
            className="absolute left-[8%] right-[8%] border-t border-primary/18"
            style={{ top: `${14 + idx * 12}%` }}
          />
        ))}

        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            className="absolute top-[8%] bottom-[8%] w-px bg-primary/15"
            style={{ left: `${12 + idx * 9}%` }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute -inset-6 rounded-full border border-primary/22"
        animate={{ rotate: -360 }}
        transition={{ duration: 42, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute -inset-11 rounded-full border border-[#f5b84b]/18 border-dashed"
        animate={{ rotate: 360 }}
        transition={{ duration: 85, ease: "linear", repeat: Infinity }}
      />

      {GLOBE_POINTS.map((point, idx) => (
        <motion.span
          key={idx}
          className="absolute h-2 w-2 rounded-full bg-[#ffd58e]"
          style={{ left: point.x, top: point.y, boxShadow: "0 0 12px #ffd58e" }}
          animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.24, 1] }}
          transition={{ duration: 2.7 + idx * 0.24, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      </motion.div>

      <div className="absolute -bottom-6 left-1/2 h-8 w-2/3 -translate-x-1/2 rounded-full bg-black/50 blur-xl" />
    </div>
  );
}
