"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, HelpCircle, LayoutDashboard, Rocket } from "lucide-react";

const landingActions = [
  { href: "/app", label: "Launch app", icon: Rocket },
  { href: "#overview", label: "Overview", icon: LayoutDashboard },
  { href: "#enter", label: "Enter", icon: HelpCircle },
];

const appActions = [
  { href: "#overview", label: "Overview", icon: LayoutDashboard },
  { href: "#mint", label: "Mint", icon: Coins },
  { href: "#status", label: "Your Bee", icon: HelpCircle },
];

export function MobileActionDock() {
  const pathname = usePathname();
  const actions = pathname && pathname.startsWith("/app") ? appActions : landingActions;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="pointer-events-auto px-4 pb-safe-sm pt-2">
        <div className="flex items-center justify-between gap-2 rounded-3xl border border-white/10 bg-black/85 p-2 shadow-lg shadow-amber-500/20 backdrop-blur-md">
          {actions.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-[0.74rem] font-semibold text-amber-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
