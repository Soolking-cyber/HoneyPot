import { formatNumber } from "@/lib/utils";
import { economics, liveMetrics, nftSupply } from "@/data/prd";
import { Sparkles } from "lucide-react";
import { HoneyPotVisual } from "@/components/ui/honey-pot";

export function HeroSection() {
  return (
    <section
      className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-12 sm:px-6 md:flex-row md:items-center"
      id="top"
    >
      <div className="flex-1 space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-300">
          <Sparkles className="h-3.5 w-3.5" /> Consensus × Linea exclusive
        </span>
        <h1 className="text-3xl font-semibold leading-snug sm:text-4xl md:text-5xl">
          Survive 420 days of deposits to split the HoneyPot.
        </h1>
        <p className="max-w-xl text-base text-stone-300 sm:text-lg">
          HoneyPot is the staking game where Bees lock in daily discipline. Mint a Bee NFT, keep a perfect 1 mUSD streak, and share the final LINEA treasure with the last swarm standing—every day&apos;s deposit auto-swaps from mUSD to LINEA before the pot is topped up.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/app"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/30 transition hover:scale-105"
          >
            Launch the app
          </a>
          <a
            href="#tokenomics"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-amber-200 transition hover:bg-white/10"
          >
            View tokenomics
          </a>
        </div>
      </div>

      <div className="flex-1 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
        <HoneyPotVisual
          balance={liveMetrics.potLinea}
          fillPercent={(liveMetrics.currentDay / economics.totalDays) * 100}
        />
        <div className="grid grid-cols-1 gap-4 text-center text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-black/30 px-4 py-6">
            <p className="text-xs uppercase tracking-[0.20em] text-stone-400">Bee supply</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatNumber(nftSupply.bees)}
            </p>
          </div>
          <div className="rounded-2xl bg-black/30 px-4 py-6">
            <p className="text-xs uppercase tracking-[0.20em] text-stone-400">Bear bounty</p>
            <p className="mt-2 text-2xl font-semibold">10% mint</p>
            <p className="mt-1 text-xs text-stone-400">Awarded randomly to the Legendary Bear holder.</p>
          </div>
          <div className="rounded-2xl bg-black/30 px-4 py-6">
            <p className="text-xs uppercase tracking-[0.20em] text-stone-400">Daily deposit</p>
            <p className="mt-2 text-2xl font-semibold">{economics.dailyDeposit} mUSD</p>
          </div>
          <div className="rounded-2xl bg-black/30 px-4 py-6">
            <p className="text-xs uppercase tracking-[0.20em] text-stone-400">Active Bees</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatNumber(liveMetrics.activeBees)}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-400/20 to-orange-500/20 px-5 py-4 text-sm text-amber-100">
          Season 01 is live. Mint closes once all {formatNumber(nftSupply.bees)} Bees are claimed.
        </div>
      </div>
    </section>
  );
}
