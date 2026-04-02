import { renderCard } from "../src/index";

export const darkCard = await renderCard({
  name: "Zachary Davison",
  jobTitle: "Co-Founder",
  org: "Little Tone Records",
  email: "hello@example.com",
  phone: "+1 555 867 5309",
  url: "https://example.com",
});

export const lightCard = await renderCard({
  name: "Jane Smith",
  jobTitle: "Senior Engineer",
  org: "Acme Corp",
  email: "jane@acme.com",
  phone: "+1234567890",
  url: "https://acme.com",
  theme: {
    background: "#f5f2ed",
    text: "#111",
    accent: "rgba(0,0,0,0.4)",
  },
});
