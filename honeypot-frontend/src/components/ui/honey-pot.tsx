import type { CSSProperties } from "react";
import { formatCurrency } from "@/lib/utils";

interface HoneyPotVisualProps {
  balance: number;
  fillPercent?: number;
  label?: string;
}

export function HoneyPotVisual({
  balance,
  fillPercent = 72,
  label = "HoneyPot balance (est)",
}: HoneyPotVisualProps) {
  const clampedFill = Math.min(96, Math.max(fillPercent, 10));
  const style = {
    "--honey-fill": `${clampedFill}%`,
  } as CSSProperties;

  return (
    <div className="honey-pot-wrapper" aria-label={label}>
      <div className="honey-pot" style={style}>
        <div className="honey-pot-lid" />
        <div className="honey-pot-neck" />
        <div className="honey-pot-body">
          <div className="honey-pot-liquid">
            <div className="honey-pot-gradient" />
            <div className="honey-pot-wave" />
            <div className="honey-pot-wave honey-pot-wave-alt" />
          </div>
          <div className="honey-pot-foam" />
          <div className="honey-pot-highlight" />
        </div>
        <div className="honey-pot-glass" />
        <div className="honey-pot-base" />
        <div className="honey-pot-shadow" />
      </div>
      <div className="text-center text-sm">
        <p className="text-xl font-semibold text-amber-200">
          {formatCurrency(balance, "USD")}
        </p>
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{label}</p>
      </div>
    </div>
  );
}
