import type { CardData, ResolvedTheme } from "./types";
import { DEFAULT_THEME } from "./types";
import { buildVCardString, generateQrSvg } from "./qr";
import { buildStyles } from "./styles";
import { buildScript } from "./script";
import { buildTemplate } from "./template";

export type { CardData, ThemeOptions } from "./types";

export async function renderCard(data: CardData): Promise<string> {
  const theme: ResolvedTheme = {
    background: data.theme?.background ?? DEFAULT_THEME.background,
    text: data.theme?.text ?? DEFAULT_THEME.text,
    accent: data.theme?.accent ?? DEFAULT_THEME.accent,
  };

  let qrSvg: string;
  if (data.qrCode) {
    qrSvg = data.qrCode;
  } else {
    const vcard = buildVCardString({
      name: data.name,
      org: data.org,
      jobTitle: data.jobTitle,
      email: data.email,
      phone: data.phone,
      url: data.url,
    });
    qrSvg = await generateQrSvg(vcard);
  }

  const css = buildStyles(theme);
  const js = buildScript();

  return buildTemplate({ data, theme, css, js, qrSvg });
}
