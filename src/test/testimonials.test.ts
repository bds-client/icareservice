import { describe, expect, it } from "vitest";
import { publicTestimonials, testimonialsSchema } from "@/lib/testimonials";

const review = { name: "Pelanggan uji", branch: "iCare Service Denpasar 1", text: "Testimoni uji", rating: 5, source: "https://maps.app.goo.gl/contoh", consent: true };
describe("Customer authorized testimonials", () => {
  it("retains all five submitted testimonials", () => {
    expect(publicTestimonials(Array.from({ length: 5 }, (_, i) => ({ ...review, name: `Pelanggan ${i}` })))).toHaveLength(5);
  });
  it("requires customer permission before publishing", () => {
    expect(testimonialsSchema.safeParse([{ ...review, consent: false }]).success).toBe(false);
    expect(publicTestimonials([{ ...review, consent: false }])).toEqual([]);
  });
  it("requires a genuine Google Maps source domain", () => {
    expect(testimonialsSchema.safeParse([{ ...review, source: "https://maps.app.goo.gl.evil.example/x" }]).success).toBe(false);
  });
});