import { economics, liveMetrics } from "@/data/prd";
import { formatCurrency, formatNumber } from "@/lib/utils";

const stats = [
  {
    label: "Pot balance",
    value: formatCurrency(liveMetrics.potLinea, "USD"),
  },
  {
    label: "Bees alive",
    value: formatNumber(liveMetrics.activeBees),
  },
  {
    label: "Eliminated",
    value: formatNumber(liveMetrics.eliminatedBees),
  },
  {
    label: "Max season cost",
    value: `${economics.totalDays * economics.dailyDeposit} mUSD`,
  },
];

export function StatsStrip() {
  return (
    <section
      className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6"
      aria-label="Live HoneyPot stats"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-sm backdrop-blur"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{stat.label}</p>
          <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
