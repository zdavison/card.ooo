import { test, expect, describe } from "bun:test";
import { buildVCardString, generateQrSvg } from "../src/qr";

describe("buildVCardString", () => {
  test("produces valid vCard 3.0 format", () => {
    const result = buildVCardString({
      name: "Jane Doe",
      org: "Acme Inc",
      jobTitle: "Engineer",
      email: "jane@acme.com",
      phone: "+1234567890",
      url: "https://acme.com",
    });
    expect(result).toStartWith("BEGIN:VCARD");
    expect(result).toContain("VERSION:3.0");
    expect(result).toContain("FN:Jane Doe");
    expect(result).toContain("ORG:Acme Inc");
    expect(result).toContain("TITLE:Engineer");
    expect(result).toContain("EMAIL:jane@acme.com");
    expect(result).toContain("TEL:+1234567890");
    expect(result).toContain("URL:https://acme.com");
    expect(result).toEndWith("END:VCARD");
  });
});

describe("generateQrSvg", () => {
  test("returns an SVG string", async () => {
    const svg = await generateQrSvg("test data");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  test("uses currentColor for fill", async () => {
    const svg = await generateQrSvg("test data");
    expect(svg).toContain('fill="currentColor"');
    expect(svg).not.toContain('fill="#ffffff"');
  });
});
