import { z } from "zod";

export function isGoogleReviewLink(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl" && url.pathname.startsWith("/maps") || (url.hostname === "www.google.com" || url.hostname === "google.com" || url.hostname === "maps.google.com") && url.pathname.startsWith("/maps");
  } catch { return false; }
}

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Isi nama pelanggan").max(100),
  branch: z.string().trim().min(1, "Pilih cabang").max(200),
  text: z.string().trim().min(1, "Isi testimoni pelanggan").max(5000),
  rating: z.number().int().min(1).max(5),
  source: z.string().url().refine(isGoogleReviewLink, "Gunakan tautan Google Maps asli dengan https"),
  consent: z.literal(true, { errorMap: () => ({ message: "Izin pelanggan diperlukan sebelum testimoni ditampilkan" }) }),
});
export const testimonialsSchema = z.array(testimonialSchema).max(100);
export type Testimonial = z.infer<typeof testimonialSchema>;

export function publicTestimonials(value: unknown): Testimonial[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = testimonialSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  }).slice(0, 100);
}