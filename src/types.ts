/** @example { background: "#111", text: "#fff", accent: "rgba(255,255,255,0.4)" } */
export interface ThemeOptions {
  /** Card background color. @default "#111" */
  background?: string;
  /** Primary text color. @default "#fff" */
  text?: string;
  /** Secondary text and divider color. @default "rgba(255,255,255,0.4)" */
  accent?: string;
}

export interface CardData {
  /** Full display name. @example "Zachary Davison" */
  name: string;
  /** Job title / role. @example "Co-Founder" */
  jobTitle: string;
  /** Organization name. @example "Little Tone Records" */
  org: string;
  /** Contact email. @example "label@littletonerecords.com" */
  email: string;
  /** Phone number with country code. @example "+353834840209" */
  phone: string;
  /** Website URL. @example "https://littletonerecords.com" */
  url: string;
  /** URL or path to logo image. @example "/assets/logo.png" */
  logo?: string;
  /** Theme color overrides. */
  theme?: ThemeOptions;
  /** Custom QR code SVG string. If omitted, a vCard QR is auto-generated. @example "<svg>...</svg>" */
  qrCode?: string;
}

export interface ResolvedTheme {
  background: string;
  text: string;
  accent: string;
}

export const DEFAULT_THEME: ResolvedTheme = {
  background: "#111",
  text: "#fff",
  accent: "rgba(255,255,255,0.4)",
};
