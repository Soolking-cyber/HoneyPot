"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileActionDock } from "@/components/ui/mobile-action-dock";
import { liveMetrics, gameSettings, hiveSnapshot, economics } from "@/data/prd";
import { formatNumber } from "@/lib/utils";
import { CheckCircle2, DollarSign } from "lucide-react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

type SlotStatus = "available" | "pending" | "deposited" | "eliminated" | "bear";

type StatusCopy = {
  title: string;
  subtitle: string;
  pill: string | null;
};

const appLinks = [
  { href: "#overview", label: "Overview" },
  { href: "#mint", label: "Mint" },
  { href: "#status", label: "Your Bee" },
  { href: "#docs", label: "Docs" },
];

export default function AppPage() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [mintMessage, setMintMessage] = useState<string | null>(null);

  const mintedCount =
    hiveSnapshot.deposited.length +
    hiveSnapshot.awaitingDeposit.length +
    hiveSnapshot.eliminated.length +
    1; // bear slot
  const mintedPercent = Math.round((mintedCount / gameSettings.totalPlayers) * 100);
  const bearSharePercent = Math.round(economics.bearSplit * 100);
  const bearMintShare = Number((economics.nftPrice * economics.bearSplit).toFixed(2));
  const bearMintShareLabel = `${bearMintShare} ${gameSettings.mintCurrency}`;
  const bearSlotId = hiveSnapshot.bearSlot ?? gameSettings.bearSlot;

  const cutoffMs = new Date(liveMetrics.nextCutoff).getTime() - Date.now();
  const minutesLeft = Math.max(Math.ceil(cutoffMs / 60_000), 0);
  const mintWindowRemaining = Math.max(gameSettings.mintWindowDays - liveMetrics.currentDay, 0);

  const isMintWindowOpen = mintWindowRemaining > 0;

  useEffect(() => {
    setMintMessage(null);
  }, [isConnected, isMintWindowOpen]);

  const handleMintClick = () => {
    if (!isMintWindowOpen) {
      setMintMessage("Mint window has closed for this season.");
      return;
    }

    if (!isConnected) {
      setMintMessage(null);
      openConnectModal?.();
      return;
    }

    setMintMessage("Minting flow will unlock once smart contracts are deployed. Check back soon.");
  };

  const depositedSet = new Set(hiveSnapshot.deposited);
  const awaitingSet = new Set(hiveSnapshot.awaitingDeposit);
  const eliminatedSet = new Set(hiveSnapshot.eliminated);
  const userSlotId = hiveSnapshot.deposited[0] ?? hiveSnapshot.awaitingDeposit[0] ?? hiveSnapshot.eliminated[0] ?? 1;

  const userStatus: SlotStatus = eliminatedSet.has(userSlotId)
    ? "eliminated"
    : depositedSet.has(userSlotId)
    ? "deposited"
    : awaitingSet.has(userSlotId)
    ? "pending"
    : "available";

  const statusCopy: Record<SlotStatus, StatusCopy> = {
    available: {
      title: "Mint your Bee",
      subtitle: `10 ${gameSettings.mintCurrency} to join the hive`,
      pill: isMintWindowOpen ? "Mint open" : "Mint closed",
    },
    pending: {
      title: "Deposit due",
      subtitle: minutesLeft > 0 ? `${minutesLeft} min left today` : "Cutoff processing",
      pill: "Deposit 1 mUSD",
    },
    deposited: {
      title: "Deposited",
      subtitle: "Safe for today",
      pill: "Streak intact",
    },
    eliminated: {
      title: "Eliminated",
      subtitle: "Streak broken",
      pill: null,
    },
    bear: {
      title: "Guardian Bear",
      subtitle: "Legendary bounty",
      pill: "Special",
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      <Header links={appLinks} mobileConnectInline />
      <main className="flex-1 space-y-12 pb-32 pb-safe sm:space-y-16 sm:pb-28 lg:pb-32">
        <section id="overview" className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-14 sm:px-6 sm:pt-16">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Honeycomb season 01</p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Keep your Bee alive and split the HoneyPot.</h1>
            <p className="max-w-2xl text-sm text-stone-300 sm:text-base">
              Mint during the seven-day hive window, deposit 1&nbsp;mUSD daily, and survive all 69 days to share the final Linea treasure with the Bees who never miss a streak.
            </p>
          </header>
          <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <InfoChip label="Game length" value={`${gameSettings.totalDays} days`} />
            <InfoChip label="Day in season" value={`Day ${liveMetrics.currentDay}`} />
            <InfoChip
              label="Deposit timer"
              value={minutesLeft > 0 ? `${minutesLeft} min left` : "Cutoff processing"}
              tone={minutesLeft > 0 ? "amber" : "neutral"}
            />
            <InfoChip
              label="Minted"
              value={`${formatNumber(mintedCount)} / ${formatNumber(
                gameSettings.totalPlayers
              )} (${mintedPercent}%)`}
            />
          </div>
        </section>

        <section id="mint" className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">Mint your Bee</h2>
            <p className="text-sm text-stone-300 sm:text-base">
              Mint price is {gameSettings.mintPrice} {gameSettings.mintCurrency}. {isMintWindowOpen
                ? `Mint window closes in ${mintWindowRemaining} day${mintWindowRemaining === 1 ? "" : "s"}.`
                : "Mint window has closed for this season."}
            </p>
            <p className="text-xs text-stone-200 sm:text-sm">
              Deposited mUSD settles before the daily cutoff, swaps into LINEA automatically, and lands in the HoneyPot contract without extra steps.
            </p>
            <button
              type="button"
              onClick={handleMintClick}
              disabled={!isMintWindowOpen}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
            >
              <DollarSign className="h-4 w-4" /> Mint Bee
            </button>
            {mintMessage ? (
              <p className="text-xs text-amber-200" role="status">
                {mintMessage}
              </p>
            ) : null}
            <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-400/10 via-orange-500/10 to-amber-400/10 px-4 py-3 text-xs text-amber-50 sm:text-sm">
              <p className="font-semibold text-amber-100">Legendary Bear NFT</p>
              <p className="mt-1 text-stone-100">
                Slot #{bearSlotId.toString().padStart(2, "0")} is granted randomly after sell out. The Bear holder claims {bearMintShareLabel} ({bearSharePercent}% of mint revenue).
              </p>
            </div>
          </div>
        </section>

        <section id="status" className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Your Bee</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">Track today&apos;s streak status.</h2>
            </header>
            <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-start sm:justify-between">
              <UserHexagon
                label={`Bee #${userSlotId.toString().padStart(2, "0")}`}
                status={userStatus}
                copy={statusCopy[userStatus]}
              />
              <ul className="space-y-3 text-xs text-stone-300 sm:max-w-sm">
                <li>• Mint during the first seven days to lock in your Bee for the season.</li>
                <li>
                  • Deposit 1 mUSD before the cutoff each day—unspent mUSD auto-converts to
                  LINEA by day&apos;s end and settles into the HoneyPot contract.
                </li>
                <li>• Miss once and your Bee is eliminated—the stake stays for surviving Bees.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="docs" className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm backdrop-blur sm:p-6">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Resources</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">HoneyPot essentials</h2>
            </header>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
                <span>Review the HoneyPot audit and contract addresses before depositing.</span>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
                <span>Join Discord for keeper coverage, cutoff alerts, and support.</span>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
                <span>
                  Email <a href="mailto:team@honeypot.game" className="underline">team@honeypot.game</a> with questions.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <MobileActionDock />
    </div>
  );
}

function InfoChip({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "amber";
}) {
  const toneClasses =
    tone === "amber"
      ? "border-amber-300/40 bg-amber-400/10 text-amber-100"
      : "border-white/10 bg-black/30 text-stone-200";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-xs sm:text-sm ${toneClasses}`}>
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-stone-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold" aria-live="polite">
        {value}
      </p>
    </div>
  );
}

function UserHexagon({
  label,
  status,
  copy,
}: {
  label: string;
  status: SlotStatus;
  copy: StatusCopy;
}) {
  return (
    <div className={`user-hex user-hex--${status}`} role="status" aria-live="polite">
      <div className="user-hex__body">
        <span className="user-hex__badge">{label}</span>
        <span className="user-hex__title">{copy.title}</span>
        <span className="user-hex__subtitle">{copy.subtitle}</span>
        {copy.pill ? <span className="user-hex__pill">{copy.pill}</span> : null}
      </div>
    </div>
  );
}
