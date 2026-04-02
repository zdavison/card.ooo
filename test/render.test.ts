import { test, expect, describe } from "bun:test";
import { renderCard } from "../src/index";

const sampleData = {
  name: "Jane Doe",
  jobTitle: "Engineer",
  org: "Acme Inc",
  email: "jane@acme.com",
  phone: "+1234567890",
  url: "https://acme.com",
};

describe("renderCard", () => {
  test("returns a complete HTML document", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  test("includes card data in output", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("Jane Doe");
    expect(html).toContain("Engineer");
    expect(html).toContain("jane@acme.com");
    expect(html).toContain("+1234567890");
    expect(html).toContain("acme.com");
  });

  test("auto-generates QR code when not provided", async () => {
    const html = await renderCard(sampleData);
    // Confirms a QR SVG was generated and injected into the output
    expect(html).toContain("<svg");
  });

  test("uses custom QR code when provided", async () => {
    const customQr = '<svg class="custom-qr"><rect/></svg>';
    const html = await renderCard({ ...sampleData, qrCode: customQr });
    expect(html).toContain('class="custom-qr"');
    // Should NOT contain auto-generated vCard QR content
    expect(html).not.toContain("BEGIN:VCARD");
  });

  test("applies default theme when none provided", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("#111");
    expect(html).toContain("#fff");
  });

  test("applies custom theme colors", async () => {
    const html = await renderCard({
      ...sampleData,
      theme: { background: "#222", text: "#eee" },
    });
    expect(html).toContain("#222");
    expect(html).toContain("#eee");
  });

  test("includes inline script for 3D effects", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("requestAnimationFrame");
    expect(html).toContain("rotateX");
    expect(html).toContain("rotateY");
  });

  test("includes logo when provided", async () => {
    const html = await renderCard({ ...sampleData, logo: "/logo.png" });
    expect(html).toContain('src="/logo.png"');
  });

  test("omits logo element when not provided", async () => {
    const html = await renderCard(sampleData);
    // The CSS class .card-logo is always in the stylesheet, but the img element should be absent
    expect(html).not.toContain('class="card-logo"');
  });

  test("strips protocol from displayed URL", async () => {
    const html = await renderCard(sampleData);
    // Should show "acme.com" not "https://acme.com" in the contact section
    expect(html).toContain(">acme.com<");
  });
});
