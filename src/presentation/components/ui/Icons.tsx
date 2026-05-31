interface IconProps {
  size?: number;
  stroke?: number;
  color?: string;
}

const baseProps = (size: number, color: string, stroke: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: stroke,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const ArrowRight = ({ size = 20, color = 'currentColor', stroke = 2 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ArrowLeft = ({ size = 20, color = 'currentColor', stroke = 2.5 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const Check = ({ size = 20, color = 'currentColor', stroke = 2.5 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <polyline points="5 13 9 17 19 7" />
  </svg>
);

export const Plus = ({ size = 18, color = 'currentColor', stroke = 2.5 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Minus = ({ size = 18, color = 'currentColor', stroke = 2.5 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Home = ({ size = 20, color = 'currentColor', stroke = 2 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const History = ({ size = 20, color = 'currentColor', stroke = 2 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const Note = ({ size = 20, color = 'currentColor', stroke = 2 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const User = ({ size = 20, color = 'currentColor', stroke = 2 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </svg>
);

export const Scan = ({ size = 20, color = 'currentColor', stroke = 2 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Fingerprint = ({ size = 14, color = 'currentColor', stroke = 2 }: IconProps) => (
  <svg {...baseProps(size, color, stroke)}>
    <path d="M12 11v3a3 3 0 0 1-3 3" />
    <path d="M6 13v-2a6 6 0 0 1 11.65-2.04" />
    <path d="M2 16.13c-.85-2.16-.85-5.96.39-7.78" />
    <path d="M12 22c-1.1 0-2-.9-2-2v-7" />
    <path d="M22 12c0-5.52-4.48-10-10-10-1.5 0-2.94.33-4.23.92" />
  </svg>
);
