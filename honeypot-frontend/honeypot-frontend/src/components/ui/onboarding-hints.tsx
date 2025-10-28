"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ArrowRight, X } from "lucide-react";

const hintSteps = [
  {
    title: "Mint your Bee",
    description:
      "Grab a Bee NFT to join the season. It unlocks deposits and your share of the final reward pot.",
    cta: { label: "Go to mint", href: "/app#mint" },
  },
  {
    title: "Keep the streak",
    description:
      "Deposit 1 mUSD per day from the dashboard. Miss once and your Bee locks for the rest of the season.",
    cta: { label: "Open dashboard", href: "/app#status" },
  },
  {
    title: "Watch the HoneyPot",
    description:
      "Track season progress and the Linea rewards pool from the live resources hub and dashboards.",
    cta: { label: "Open docs", href: "/app#docs" },
  },
] as const;

export function OnboardingHints() {
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const storageKey = useMemo(() => {
    if (!address) {
      return "";
    }
    return `honeypot_hints_seen_${address.toLowerCase()}`;
  }, [address]);

  useEffect(() => {
    if (!isConnected || !address) {
      setIsOpen(false);
      setStepIndex(0);
      return;
    }

    if (typeof window === "undefined" || !storageKey) {
      return;
    }

    const alreadySeen = window.localStorage.getItem(storageKey);
    if (!alreadySeen) {
      setIsOpen(true);
    }
  }, [address, isConnected, storageKey]);

  const completeHints = () => {
    if (typeof window !== "undefined" && storageKey) {
      window.localStorage.setItem(storageKey, "true");
    }
    setIsOpen(false);
    setStepIndex(0);
  };

  const goToNextStep = () => {
    const next = stepIndex + 1;
    if (next >= hintSteps.length) {
      completeHints();
      return;
    }
    setStepIndex(next);
  };

  if (!isOpen) {
    return null;
  }

  const currentStep = hintSteps[stepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 py-6 sm:items-center">
      <div className="relative w-full max-w-md rounded-3xl border border-amber-400/40 bg-[#120d18] p-6 text-sm shadow-2xl shadow-amber-500/30">
        <button
          aria-label="Dismiss onboarding hints"
          className="absolute right-4 top-4 rounded-full border border-white/10 p-1 text-amber-200 hover:bg-white/10"
          onClick={completeHints}
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Quick tour</p>
        <h3 className="mt-3 text-xl font-semibold text-amber-100">{currentStep.title}</h3>
        <p className="mt-2 text-sm text-stone-200">{currentStep.description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={currentStep.cta.href}
            onClick={completeHints}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-sm font-semibold text-stone-950 transition hover:scale-[1.02]"
          >
            {currentStep.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:bg-white/10"
            onClick={goToNextStep}
          >
            {stepIndex === hintSteps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
        <div className="mt-6 flex items-center justify-between text-xs text-amber-200/70">
          <span>Step {stepIndex + 1} of {hintSteps.length}</span>
          <button className="underline" onClick={completeHints}>
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
