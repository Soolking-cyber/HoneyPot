import type { CSSProperties } from "react";

interface AnimatedBeeProps {
  size?: number;
  trailLabel?: string;
}

export function AnimatedBee({ size = 240, trailLabel }: AnimatedBeeProps) {
  const style = {
    "--bee-size": `${size}px`,
  } as CSSProperties;

  return (
    <div className="bee-wrapper" style={style} aria-hidden="true">
      <div className="bee-flight">
        <div className="bee">
          <div className="bee-wing bee-wing-left" />
          <div className="bee-wing bee-wing-right" />
          <div className="bee-body">
            <div className="bee-stripe" />
            <div className="bee-stripe" />
            <div className="bee-stripe" />
            <div className="bee-eye bee-eye-left" />
            <div className="bee-eye bee-eye-right" />
            <div className="bee-stinger" />
          </div>
        </div>
        <div className="bee-trail">
          <span className="bee-dot" />
          <span className="bee-dot" />
          <span className="bee-dot" />
        </div>
      </div>
      {trailLabel ? <p className="bee-label">{trailLabel}</p> : null}
    </div>
  );
}
