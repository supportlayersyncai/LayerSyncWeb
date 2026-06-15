import React from 'react';

/**
 * LayerSync custom icon set.
 *
 * A bespoke, cohesive icon family drawn in the same rounded-stroke language as
 * the brand mark (round caps/joins, ~1.7 stroke, layered/orbital motifs). These
 * replace the generic stock icons on the feature/value card grids so the site
 * carries its own character. All icons inherit `currentColor`, so the existing
 * brand-tinted tiles colour them automatically.
 */

interface IconProps {
  className?: string;
}

const Base: React.FC<IconProps & { children: React.ReactNode }> = ({ className = 'w-6 h-6', children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

// ── Home · Why LayerSync ────────────────────────────────────────────────
export const DeployIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8,13 12,9 16,13" />
    <polyline points="8,17 12,13 16,17" />
  </Base>
);

export const SecurityIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z" />
    <path d="M9 12l2.2 2.2L15 10.4" />
  </Base>
);

export const RoiIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M4 19h16" />
    <path d="M7 19v-4" />
    <path d="M12 19v-7" />
    <path d="M17 19v-10" />
    <polyline points="6,12 10.5,8 13.5,11 19,5" />
    <polyline points="15.5,5 19,5 19,8.5" />
  </Base>
);

export const MarketsIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 12h17" />
    <path d="M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="16" cy="14" r="1" />
  </Base>
);

// ── Web Dev · Why Us ────────────────────────────────────────────────────
export const CraftIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M7 4h10l4 5-9 11L3 9z" />
    <path d="M3 9h18" />
    <path d="M9.5 4l-2 5 4.5 11 4.5-11-2-5" />
  </Base>
);

export const DataIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 0 1 6.9 12" />
    <circle cx="12" cy="12" r="2.4" />
  </Base>
);

export const PerformanceIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M9 21h6M12 17v4" />
    <polyline points="6.5,11 9,11 10.5,8 12.5,13.5 14,11 17.5,11" />
  </Base>
);

export const StrategyIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" />
    <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" />
  </Base>
);

export const SpeedIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M13 3l-7 9h5l-1 8 7-9h-5z" />
    <path d="M3 9h2.5M3.5 15H6" />
  </Base>
);

export const CompassIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="12,7 14.5,14.5 12,13 9.5,14.5" />
    <circle cx="12" cy="12" r="0.6" />
  </Base>
);

// ── Academy · Department Tracks ─────────────────────────────────────────
export const LeadershipIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <rect x="3.5" y="8.5" width="17" height="11" rx="2" />
    <path d="M8.5 8.5V7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
    <path d="M3.5 13h17" />
    <path d="M12 12.5v1" />
  </Base>
);

export const OperationsIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
  </Base>
);

export const FinanceIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" />
    <path d="M5.5 6.5v5c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-5" />
    <path d="M5.5 11.5v5c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-5" />
  </Base>
);

export const PeopleIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="8.5" cy="9" r="2.6" />
    <circle cx="16" cy="10" r="2.2" />
    <path d="M3.5 19c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6" />
    <path d="M14.5 19c0-2.2 1-3.7 3-4" />
  </Base>
);

export const SalesIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M4 19h16" />
    <polyline points="5,15 10,10 13,13 19,6.5" />
    <polyline points="15.5,6.5 19,6.5 19,10" />
    <circle cx="10" cy="10" r="0.6" />
    <circle cx="13" cy="13" r="0.6" />
  </Base>
);

export const MarketingIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M4 10v4l9 4V6z" />
    <path d="M4 10H3.5a1.5 1.5 0 0 0 0 3H4" />
    <path d="M13 8.5c2 .5 3.5 1.7 3.5 3.5s-1.5 3-3.5 3.5" />
    <path d="M8 14.5V18a1.5 1.5 0 0 0 3 0v-1" />
  </Base>
);

export const ComplianceIcon: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M12 4v15" />
    <path d="M6 19h12" />
    <path d="M5 7h14" />
    <path d="M5 7l-2.5 5h5z" />
    <path d="M19 7l-2.5 5h5z" />
    <circle cx="12" cy="4" r="0.8" />
  </Base>
);
