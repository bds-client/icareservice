import { z } from "zod";

export interface PricelistRow {
  model: string;
  quality: string;
  price: string;
}

export interface PricelistService {
  name: string;
  rows: PricelistRow[];
}

export interface PricelistCategory {
  name: string;
  services: PricelistService[];
}

export const pricelistSchema: z.ZodType<PricelistCategory[]> = z.array(
  z.object({
    name: z.string().max(100),
    services: z.array(
      z.object({
        name: z.string().max(100),
        rows: z.array(
          z.object({
            model: z.string().max(200),
            quality: z.string().max(300),
            price: z.string().max(100),
          }),
        ),
      }),
    ),
  }),
);

const QUALITY_DEFAULT = "Garansi hingga 36 bulan · Gratis ongkos pasang · Pengerjaan mulai 30 menit";

export const defaultPricelist: PricelistCategory[] = [
  {
    name: "iPhone",
    services: [
      {
        name: "Ganti LCD / Layar",
        rows: [
          { model: "Layar iPhone (OEM)", quality: QUALITY_DEFAULT, price: "Rp 850.000" },
          { model: "Layar iPhone (Original)", quality: QUALITY_DEFAULT, price: "Rp 1.500.000" },
        ],
      },
      {
        name: "Ganti Baterai",
        rows: [
          { model: "Baterai iPhone (OEM)", quality: QUALITY_DEFAULT, price: "Rp 350.000" },
          { model: "Baterai iPhone (Original)", quality: QUALITY_DEFAULT, price: "Rp 650.000" },
        ],
      },
      {
        name: "Servis Lainnya",
        rows: [
          { model: "Kamera Belakang", quality: QUALITY_DEFAULT, price: "Rp 750.000" },
          { model: "Kamera Depan", quality: QUALITY_DEFAULT, price: "Rp 450.000" },
          { model: "Charging Port", quality: QUALITY_DEFAULT, price: "Rp 400.000" },
          { model: "Backglass / Casing Belakang", quality: QUALITY_DEFAULT, price: "Rp 550.000" },
          { model: "Speaker / Ear Speaker", quality: QUALITY_DEFAULT, price: "Rp 300.000" },
          { model: "Tombol Home / Power", quality: QUALITY_DEFAULT, price: "Rp 250.000" },
        ],
      },
    ],
  },
  ...(["Apple Watch", "iPad", "MacBook"] as const).map((name) => ({
    name,
    services: ["Ganti LCD / Layar", "Ganti Baterai", "Servis Lainnya"].map((svc) => ({
      name: svc,
      rows: [] as PricelistRow[],
    })),
  })),
];
