/** @example { background: "#111", text: "#fff", accent: "rgba(255,255,255,0.4)" } */
export interface ThemeOptions {
  /** Card background color. @default "#111" */
  background?: string;
  /** Primary text color. @default "#fff" */
  text?: string;
  /** Secondary text and divider color. @default "rgba(255,255,255,0.4)" */
  accent?: string;
  /** CSS filter applied to the logo image. @default "none" @example "invert(1)" */
  logoFilter?: string;
  /** Color of the QR code. @default "#fff" @example "#ffffff" */
  qrColor?: string;
  /** Font family for card text. @default "system-ui, -apple-system, sans-serif" @example "'Alte Haas Grotesk', sans-serif" */
  fontFamily?: string;
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
  /** Raw CSS @font-face declarations to inject. @example "@font-face { font-family: 'My Font'; src: url('/font.woff2') format('woff2'); }" */
  fontFaces?: string;
}

export interface ResolvedTheme {
  background: string;
  text: string;
  accent: string;
  logoFilter: string;
  qrColor: string;
  fontFamily: string;
}

export const DEFAULT_THEME: ResolvedTheme = {
  background: "#111",
  text: "#fff",
  accent: "rgba(255,255,255,0.4)",
  logoFilter: "none",
  qrColor: "#fff",
  fontFamily: "system-ui, -apple-system, sans-serif",
};
