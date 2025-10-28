import { roadmap } from "@/data/prd";

const statusStyles: Record<string, string> = {
  done: "bg-emerald-400/20 text-emerald-200 border-emerald-400/40",
  current: "bg-amber-400/20 text-amber-200 border-amber-400/40",
  upcoming: "bg-white/5 text-stone-300 border-white/10",
};

export function RoadmapSection() {
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Roadmap</p>
      <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Phased rollout across prototype, beta, and mainnet launch.</h2>
      <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
        {roadmap.map((milestone) => (
          <div
            key={milestone.phase}
            className={`rounded-3xl border ${statusStyles[milestone.status]} p-5 backdrop-blur sm:p-6`}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{milestone.phase}</p>
            <h3 className="mt-2 text-xl font-semibold">{milestone.label}</h3>
            <ul className="mt-4 space-y-2 text-sm text-stone-200">
              {milestone.details.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-amber-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
