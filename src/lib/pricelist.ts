import { z } from "zod";

export interface PricelistRow { model: string; quality: string; price: string; }
export interface PricelistService { name: string; rows: PricelistRow[]; }
export interface PricelistCategory { name: string; services: PricelistService[]; }

export const pricelistSchema: z.ZodType<PricelistCategory[]> = z.array(
  z.object({
    name: z.string().max(100),
    services: z.array(z.object({
      name: z.string().max(100),
      rows: z.array(z.object({
        model: z.string().max(200),
        quality: z.string().max(300),
        price: z.string().max(100),
      })),
    })),
  }),
);

const tiers = [
  "Garansi 12 Bulan · Kualitas FHD",
  "Garansi 18 Bulan · Kualitas OLED",
  "Garansi 36 Bulan · Original",
];

const posterPrices = [
  ["iPhone 7", "149", "-", "239"], ["iPhone 7 Plus", "159", "-", "339"],
  ["iPhone 8", "149", "-", "239"], ["iPhone 8 Plus", "179", "-", "339"],
  ["iPhone X", "279", "499", "659"], ["iPhone XR", "259", "359", "439"],
  ["iPhone XS", "279", "499", "729"], ["iPhone XS Max", "299", "599", "999"],
  ["iPhone 11", "299", "369", "459"], ["iPhone 11 Pro", "339", "599", "1.099"],
  ["iPhone 11 Pro Max", "369", "639", "1.399"], ["iPhone 12 Mini", "459", "999", "1.299"],
  ["iPhone 12", "389", "719", "1.199"], ["iPhone 12 Pro", "399", "699", "1.299"],
  ["iPhone 12 Pro Max", "459", "999", "1.499"], ["iPhone 13 Mini", "429", "1.099", "1.759"],
  ["iPhone 13", "399", "899", "1.099"], ["iPhone 13 Pro", "599", "1.099", "1.759"],
  ["iPhone 13 Pro Max", "699", "1.199", "1.859"], ["iPhone 14", "399", "999", "1.299"],
  ["iPhone 14 Plus", "599", "1.059", "2.499"], ["iPhone 14 Pro", "649", "1.699", "2.299"],
  ["iPhone 14 Pro Max", "699", "1.499", "2.599"], ["iPhone 15", "699", "1.999", "2.199"],
  ["iPhone 15 Plus", "699", "1.399", "2.599"], ["iPhone 15 Pro", "749", "2.099", "2.299"],
  ["iPhone 15 Pro Max", "749", "1.799", "2.899"], ["iPhone 16", "979", "2.099", "2.999"],
  ["iPhone 16 Plus", "999", "1.759", "2.999"], ["iPhone 16 Pro", "1.098", "2.099", "3.999"],
  ["iPhone 16 Pro Max", "1.198", "2.199", "3.999"], ["iPhone 16e", "-", "-", "-"],
  ["iPhone 17", "1.199", "2.199", "3.299"], ["iPhone 17 Pro", "1.199", "2.399", "3.799"],
  ["iPhone 17 Pro Max", "1.199", "2.599", "4.599"], ["iPhone 17 Air", "-", "-", "4.299"],
] as const;

const priceText = (value: string | undefined) => !value || value === "-" ? "-" : `Rp ${value}.000`;
const makeRows = (battery = false): PricelistRow[] => posterPrices.flatMap((row) =>
  tiers.map((quality, index) => ({
    model: row[0],
    quality,
    price: battery ? "-" : priceText(row[index + 1]),
  })),
);

export const defaultPricelist: PricelistCategory[] = [{
  name: "iPhone",
  services: [
    { name: "LCD", rows: makeRows() },
    { name: "Baterai", rows: makeRows(true) },
  ],
}];
