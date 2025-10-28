import { memo } from "react";

export interface BeeLoaderProps {
  message?: string;
  "aria-label"?: string;
}

/**
 * Animated loader that shows a bee looping around a honey path.
 */
export const BeeLoader = memo(function BeeLoader({
  message = "Gathering nectar...",
  "aria-label": ariaLabel = "Bee flying in a loop",
}: BeeLoaderProps) {
  return (
    <div className="bee-loader" role="status" aria-live="polite">
      <div className="bee-loader__orbit" aria-hidden="true">
        <span className="bee-loader__path" />
        <span className="bee-loader__bee" role="img" aria-label={ariaLabel}>
          🐝
        </span>
        <span className="bee-loader__trail bee-loader__trail--1" />
        <span className="bee-loader__trail bee-loader__trail--2" />
        <span className="bee-loader__trail bee-loader__trail--3" />
      </div>
      {message ? <p className="bee-loader__message">{message}</p> : null}
    </div>
  );
});

