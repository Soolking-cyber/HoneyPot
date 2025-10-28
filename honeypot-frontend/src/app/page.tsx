import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileActionDock } from "@/components/ui/mobile-action-dock";
import { BeeHive } from "@/components/landing/bee-hive";
import { getBeeImagePaths } from "@/lib/bee-images";

const navLinks = [
  { href: "#overview", label: "Overview" },
  { href: "#how", label: "How it works" },
  { href: "#enter", label: "Enter app" },
];

export default function Home() {
  const beeImages = getBeeImagePaths();

  return (
    <div className="flex min-h-screen flex-col">
      <Header links={navLinks} showConnect={false} />
      <main className="flex-1 space-y-12 pb-32 pb-safe sm:space-y-16 sm:pb-28 lg:pb-32">
        <section
          id="overview"
          className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pt-14 text-center sm:px-6 sm:pt-16"
        >
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.26em] text-amber-300">Honeycomb Season 01</p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
              Mint one of 124 Bees. Survive 69 days. Share the Linea HoneyPot.
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-stone-300 sm:text-lg">
              HoneyPot is a streak survival challenge on Linea. Mint during the seven-day window, deposit 1&nbsp;mUSD each day, and split the final pot with the Bees who never miss.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/app#mint"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/30 transition hover:scale-[1.02] sm:w-auto"
              >
                Launch the app
              </Link>
              <Link
                href="/app#status"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-8 py-3 text-sm font-semibold text-amber-200 transition hover:bg-white/10 sm:w-auto"
              >
                View my Bee status
              </Link>
            </div>
            <BeeHive images={beeImages} />
          </div>
        </section>

        <section id="how" className="mx-auto grid w-full max-w-5xl gap-4 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6">
          {[
            {
              title: "Mint",
              body: "Claim one of 124 Bee NFTs during the seven-day mint window.",
            },
            {
              title: "Deposit",
              body: "Keep your Bee alive by depositing 1 mUSD before the daily cutoff—every sweep converts to LINEA that night.",
            },
            {
              title: "Survive",
              body: "Make it through all 69 days to split the HoneyPot with the hive.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm backdrop-blur sm:p-6"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">{card.title}</p>
              <p className="text-sm text-stone-200 sm:text-base">{card.body}</p>
            </div>
          ))}
        </section>

        <section id="enter" className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm backdrop-blur">
            <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">Ready to enter the hive?</h2>
            <p className="text-sm text-stone-300 sm:text-base">
              Head to the app to mint, deposit, and monitor your streak. Daily mUSD sweeps automatically swap to LINEA before they&apos;re deposited into the HoneyPot contract. Connect your wallet inside the dashboard when you&apos;re ready.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:scale-[1.02] sm:w-auto"
              >
                Go to app dashboard
              </Link>
              <Link
                href="mailto:team@honeypot.game"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-amber-200 transition hover:bg-white/10 sm:w-auto"
              >
                Talk to the team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileActionDock />
    </div>
  );
}
