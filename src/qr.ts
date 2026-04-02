import QRCode from "qrcode";

interface VCardFields {
  name: string;
  org: string;
  jobTitle: string;
  email: string;
  phone: string;
  url: string;
}

export function buildVCardString(fields: VCardFields): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fields.name}`,
    `ORG:${fields.org}`,
    `TITLE:${fields.jobTitle}`,
    `EMAIL:${fields.email}`,
    `TEL:${fields.phone}`,
    `URL:${fields.url}`,
    "END:VCARD",
  ].join("\n");
}

export async function generateQrSvg(data: string): Promise<string> {
  const svg = await QRCode.toString(data, {
    type: "svg",
    margin: 0,
    // Transparent background, black QR modules — stroke is replaced below
    color: { dark: "#000000", light: "#00000000" },
  });
  // The qrcode library renders QR modules as stroke on path elements.
  // Replace stroke with fill so consumers can use CSS currentColor theming.
  return svg.replace(/stroke="#000000"/g, 'fill="currentColor"');
}
