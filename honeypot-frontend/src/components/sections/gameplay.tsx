import { gameplayLoop } from "@/data/prd";

export function GameplaySection() {
  return (
    <section id="gameplay" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Gameplay loop</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Three moves to earn the hive&apos;s treasure.</h2>
          <p className="text-sm text-stone-300 sm:text-base">
            The HoneyPot contract tracks daily discipline on-chain. Miss the 24 hour window and your Bee locks, preserving your past deposits for the swarm.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {gameplayLoop.map((step, index) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <span className="absolute right-4 top-4 text-6xl font-bold text-white/5">{index + 1}</span>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Step {index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-stone-300">{step.description}</p>
              <span className="mt-6 inline-flex rounded-full border border-amber-400/40 px-4 py-1 text-xs font-medium text-amber-200">
                {step.cta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
