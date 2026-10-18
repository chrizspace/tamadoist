/** Design tokens — mirror the Figma "Tokens" variable collection and src/styles.css. */
export const colors = {
  primary: "#1FBF8F",
  primaryDark: "#159A72",
  primarySoft: "#DDF7EE",
  accent: "#FFC93C",
  accentDark: "#E0A800",
  water: "#4CC3FF",
  waterDark: "#2A9BD8",
  waterSoft: "#DFF4FF",
  night: "#4B4FA8",
  nightSoft: "#E6E7FA",
  danger: "#FF5A5F",
  bg: "#FFFFFF",
  surface: "#F4F7F6",
  border: "#E2E8E6",
  text: "#1F2D2A",
  textMuted: "#6B7C77",
  onPrimary: "#FFFFFF",
  sky: "#E6FAF6",
  skyNight: "#C9CCF2",
  hillFar: "#8EC5FF",
  hill: "#10B38A",
  hillNight: "#0E8C72",
  tree: "#0B8F6F",
  treeTrunk: "#2D6FA3",
} as const;

export const space = { 4: 4, 8: 8, 12: 12, 16: 16, 24: 24, 32: 32 } as const;
export const radius = { sm: 8, md: 16, lg: 24, full: 999 } as const;
export const typography = {
  fontFamily: "Nunito, system-ui, sans-serif",
  display: { size: 32, weight: 800 },
  title: { size: 24, weight: 800 },
  heading: { size: 18, weight: 700 },
  body: { size: 16, weight: 600 },
  caption: { size: 13, weight: 600 },
  button: { size: 16, weight: 800 },
} as const;

/**
 * Zones of a 390x844 scene screen (px from the top).
 * topbar: menu/back + title. rail: round indicators stacked on the right edge.
 * interaction: progress / notification, right above the action dock. dock: action buttons.
 * Everything else is the scene: only the character (and its name tag) is drawn there,
 * so scene animations can use all of it.
 */
export const LAYOUT = {
  topbar: { top: 48, bottom: 112 },
  rail: { top: 124, right: 16, width: 40 },
  scene: { top: 112, bottom: 632 },
  interaction: { top: 632, bottom: 696 },
  dock: { top: 712, bottom: 844 },
} as const;
