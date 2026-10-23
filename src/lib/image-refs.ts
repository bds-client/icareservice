import { z } from "zod";

// Referensi foto: "asset:<kunci>" untuk foto bawaan, "gallery:<path>" atau "site:<path>" untuk unggahan.
export const imageRefSchema = z
  .string()
  .regex(
    /^asset:(hero|about|svc-(diag|screen|battery))$|^(gallery|site):[\w][\w./-]{0,200}$/,
    "Pilihan foto tidak valid",
  );

export const imagesSchema = z.object({
  hero: imageRefSchema,
  about: imageRefSchema,
  services: z.array(imageRefSchema).min(1).max(20),
});

export type ImagesContent = z.infer<typeof imagesSchema>;

export const defaultImages: ImagesContent = {
  hero: "asset:hero",
  about: "asset:about",
  services: ["asset:svc-diag", "asset:svc-screen", "asset:svc-battery"],
};
