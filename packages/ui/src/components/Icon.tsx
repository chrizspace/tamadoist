export const ICON_PATHS = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  back: <path d="M15 5l-7 7 7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  drop: <path d="M12 2.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  settings: (<><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>),
  edit: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />,
  logout: <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M15 8l4 4-4 4M19 12H9" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  pin: (<><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  list: (<><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="3" /></>),
  repeat: (<><path d="M17 3l3 3-3 3" /><path d="M4 11V9a3 3 0 0 1 3-3h13" /><path d="M7 21l-3-3 3-3" /><path d="M20 13v2a3 3 0 0 1-3 3H4" /></>),
  utensils: (<><path d="M7 3v7a2 2 0 0 0 2 2v9M5 3v6M9 3v6" /><path d="M17 21V3c-2.200 1-3.500 3.500-3.500 7 0 1.800.8 3 2 3h1.500" /></>),
  care: (<>
    <g transform="translate(-0.4 0.2) scale(0.53)" strokeWidth="3.8"><path d="M7 3v7a2 2 0 0 0 2 2v9M5 3v6M9 3v6" /><path d="M17 21V3c-2.200 1-3.500 3.500-3.500 7 0 1.800.8 3 2 3h1.500" /></g>
    <g transform="translate(11.9 0.2) scale(0.53)" strokeWidth="3.8"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></g>
    <g transform="translate(5.75 11.2) scale(0.53)" strokeWidth="3.8"><path d="M12 2.5s6 6.500 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z" /></g>
  </>),
  recharge: (<><rect x="2.5" y="6.5" width="16" height="11" rx="3" /><path d="M21.5 10.5v3" /><path d="M11.8 8.8 9.2 12.2h3.6l-2.6 3.2" /></>),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600l1.400 1.400M17 17l1.400 1.400M18.400 5.600 17 7M7 17l-1.400 1.400" /></>),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  target: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></>),
} as const;

export type IconName = keyof typeof ICON_PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}
