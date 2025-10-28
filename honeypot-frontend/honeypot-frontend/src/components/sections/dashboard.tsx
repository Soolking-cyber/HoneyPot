import { economics, liveMetrics } from "@/data/prd";
import { formatNumber, timeUntil } from "@/lib/utils";
import { Flame, Timer, Trophy } from "lucide-react";

export function DashboardSection() {
  const cutoff = timeUntil(liveMetrics.nextCutoff);
  const progress = Math.min(
    100,
    Math.round((liveMetrics.currentDay / economics.totalDays) * 100)
  );

  return (
    <section id="dashboard" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Player cockpit</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Watch your streak, stay alive, and monitor the HoneyPot.</h2>
          <p className="text-sm text-stone-300 sm:text-base">
            Every interaction routes through the Pot contract. Deposits, eliminations, and payouts are transparent and provable in real-time dashboards.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-amber-200" />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Next deposit window</p>
                <p className="text-lg font-semibold">{cutoff}</p>
              </div>
            </div>
            <p className="text-sm text-stone-300">
              Missing this window auto-eliminates your Bee. Every day&apos;s mUSD is swept into LINEA at cutoff and deposited straight into the HoneyPot contract, so set reminders or delegate deposits through the Keeper bots.
            </p>
            <button className="w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:scale-[1.02]">
              Deposit 1 mUSD now
            </button>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-amber-200" />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Active streaks</p>
                <p className="text-lg font-semibold">Top Bees</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {liveMetrics.streakLeaders.map((leader) => (
                <li
                  key={leader.wallet}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/30 px-4 py-3"
                >
                  <span className="font-mono text-xs text-stone-200">{leader.wallet}</span>
                  <span className="text-sm font-semibold text-amber-200">{leader.streak} days</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/25 via-orange-500/20 to-transparent p-5 sm:p-6 md:col-span-2">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-amber-900" />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-amber-900/80">Season progress</p>
                <p className="text-lg font-semibold text-stone-950">
                  Day {formatNumber(liveMetrics.currentDay)} / {formatNumber(economics.totalDays)}
                </p>
              </div>
            </div>
            <div className="mt-5 h-2 rounded-full bg-black/30">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-stone-900/80">
              <span>Pot accretion</span>
              <span>{formatNumber(liveMetrics.activeBees)} Bees competing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
