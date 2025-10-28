"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OnboardingHints } from "@/components/ui/onboarding-hints";

type HeaderLink = { href: string; label: string };

type HeaderProps = {
  links?: HeaderLink[];
  showConnect?: boolean;
  mobileConnectInline?: boolean;
};

const defaultLinks: HeaderLink[] = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#gameplay", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function Header({ links, showConnect = true, mobileConnectInline = false }: HeaderProps) {
  const navLinks = useMemo(() => links ?? defaultLinks, [links]);

  return (
    <>
      <header className="pt-safe sticky top-0 z-30 border-b border-white/10 bg-[#05040acc] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 font-bold">
              🐝
            </span>
            <span className="tracking-tight">HoneyPot</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {showConnect ? (
              <>
                {mobileConnectInline ? (
                  <div className="md:hidden">
                    <ConnectButton
                      label="Connect"
                      chainStatus="icon"
                      showBalance={false}
                      accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
                    />
                  </div>
                ) : null}
                <div className="hidden md:block">
                  <ConnectButton
                    label="Connect"
                    chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
                    showBalance={false}
                    accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
                  />
                </div>
              </>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </div>

        {showConnect && !mobileConnectInline ? (
          <div className="border-t border-white/5 bg-black/70 px-4 py-3 md:hidden">
            <ConnectButton
              label="Connect"
              chainStatus="icon"
              showBalance={false}
              accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
            />
          </div>
        ) : null}
      </header>
      {showConnect ? <OnboardingHints /> : null}
    </>
  );
}
