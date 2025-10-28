import { economics, potBreakdown } from "@/data/prd";
import { formatPercentage } from "@/lib/utils";

const revenueSplit = [
  { label: "Pot contract", value: economics.potSplit, description: "Seeds the reward pool instantly." },
  { label: "Creator", value: economics.creatorSplit, description: "Funds development, audits, and operations." },
  {
    label: "Bear NFT",
    value: economics.bearSplit,
    description: "Random Legendary Bear holder claims a 10% mint share once the drop sells out.",
  },
];

export function TokenomicsSection() {
  return (
    <section id="tokenomics" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Tokenomics</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Fair split between the hive, the creator, and the Bear.</h2>
          <p className="text-sm text-stone-300 sm:text-base">
            Mint proceeds enter the HoneyPot contract through a non-upgradable splitter. Each day&apos;s mUSD sweep auto-swaps into LINEA before the cutoff and grows the rewards chest throughout the season.
          </p>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm sm:p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Mint price</p>
            <p className="mt-2 text-3xl font-semibold">{economics.nftPrice} mUSD</p>
            <p className="mt-4 text-stone-300">Max commitment if you survive every day: {economics.totalDays * economics.dailyDeposit} mUSD.</p>
          </div>
        </div>
        <div className="space-y-8">
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-stone-400">Initial sale split</p>
            {revenueSplit.map((slice) => (
              <div key={slice.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{slice.label}</span>
                  <span className="text-amber-200">{formatPercentage(slice.value * 100)}</span>
                </div>
                <div className="h-2 rounded-full bg-black/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${slice.value * 100}%` }}
                  />
                </div>
                <p className="text-xs text-stone-400">{slice.description}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-stone-400">Pot growth drivers</p>
            {potBreakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/30 p-4 text-sm"
              >
                <span className="text-lg font-semibold text-amber-200">{item.value}%</span>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-stone-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
