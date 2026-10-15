import { useId } from "react";
import { BRAND } from "@/lib/brand";

// Emblem: a coffee bean that sprouts two leaves, inside a fine ring.
// Seed to cup: the bean is the seed, the amber leaves are what it grows into.
// Drawn in a 64x64 box with currentColor, so it takes the surrounding text colour.
export function EmblemShapes({
  maskId,
  ring = true,
}: {
  maskId: string;
  ring?: boolean;
}) {
  return (
    <g>
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="64" height="64" fill="#fff" />
          <path
            d="M33.5 25C27 33 38.5 45 30.5 55"
            fill="none"
            stroke="#000"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </mask>
      </defs>
      {ring && (
        <circle
          cx="32"
          cy="32"
          r="30.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      )}
      <ellipse
        cx="32"
        cy="40"
        rx="11.5"
        ry="16.5"
        transform="rotate(-18 32 40)"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
      <path
        d="M37.2 24.2C36.8 19.5 35 16 32 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M34.2 17C36.5 10.5 43.5 9.5 48 12C47 18.5 40.5 21.5 34.2 17Z"
        className="fill-amber"
      />
      <path
        d="M32.3 13.2C29.5 7.5 22.5 7 18.5 10C20 16 27 18.5 32.3 13.2Z"
        className="fill-amber"
      />
    </g>
  );
}

export function Emblem({
  className = "",
  ring = true,
}: {
  className?: string;
  ring?: boolean;
}) {
  const maskId = `emblem-${useId()}`;
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <EmblemShapes maskId={maskId} ring={ring} />
    </svg>
  );
}

// Horizontal lockup: emblem + wordmark. Size it with a text-size class.
export function Logo({
  className = "",
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  return (
    <span
      role="img"
      aria-label={BRAND.name}
      className={`inline-flex items-center leading-none ${
        stacked ? "flex-col gap-[0.5em]" : "gap-[0.6em]"
      } ${className}`}
    >
      <Emblem className="h-[2.3em] w-[2.3em] shrink-0" />
      <span
        aria-hidden="true"
        className="font-heading font-medium tracking-[0.2em] whitespace-nowrap"
      >
        {BRAND.name.toUpperCase()}
      </span>
    </span>
  );
}
