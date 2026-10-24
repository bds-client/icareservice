export interface PriceService {
  name: string;
  price: string;
  parts: string;
  installCost: string;
  estimate: string;
  warranty: string;
}

export interface PriceModel {
  name: string;
  services: PriceService[];
}

export interface PriceCategory {
  id: string;
  name: string;
  description: string;
  models: PriceModel[];
}

const defaultOptions = {
  price: "Hubungi untuk harga",
  parts: "OEM / kompatibel\nOriginal copotan\nOriginal service pack",
  installCost: "Gratis",
  estimate: "Konfirmasi teknisi",
  warranty: "Dikonfirmasi sebelum pengerjaan",
};

function makeModels(names: string[], serviceNames: string[]): PriceModel[] {
  return names.map((name) => ({
    name,
    services: serviceNames.map((service) => ({ name: service, ...defaultOptions })),
  }));
}

export const defaultPricelist: PriceCategory[] = [
  {
    id: "iphone",
    name: "iPhone",
    description: "Servis layar, baterai, kamera, dan lainnya.",
    models: makeModels(
      ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 12 Series", "iPhone 11 Series", "iPhone X Series", "iPhone 8 Series"],
      ["Ganti layar", "Ganti baterai", "Ganti kamera", "Perbaikan charging", "Perbaikan speaker", "Perbaikan software"],
    ),
  },
  {
    id: "watch",
    name: "Apple Watch",
    description: "Pemeriksaan dan perbaikan Apple Watch.",
    models: makeModels(
      ["Apple Watch Ultra 2", "Apple Watch Ultra", "Apple Watch Series 10", "Apple Watch Series 9", "Apple Watch Series 8", "Apple Watch Series 7", "Apple Watch SE (Gen 2)", "Apple Watch SE"],
      ["Ganti layar", "Ganti baterai", "Perbaikan crown / tombol", "Pemeriksaan unit"],
    ),
  },
  {
    id: "ipad",
    name: "iPad",
    description: "Servis iPad untuk kebutuhan kerja dan harian.",
    models: makeModels(
      ["iPad Pro 13-inch (M4)", "iPad Pro 11-inch (M4)", "iPad Pro 12.9-inch", "iPad Pro 11-inch", "iPad Air 13-inch", "iPad Air 11-inch", "iPad Air", "iPad mini", "iPad"],
      ["Ganti layar / LCD", "Ganti baterai", "Perbaikan charging", "Perbaikan kamera", "Perbaikan software"],
    ),
  },
  {
    id: "macbook",
    name: "MacBook",
    description: "Pemeriksaan dan servis MacBook.",
    models: makeModels(
      ["MacBook Pro 16-inch (Apple silicon)", "MacBook Pro 14-inch (Apple silicon)", "MacBook Pro 13-inch", "MacBook Air 15-inch", "MacBook Air 13-inch", "MacBook Air (Intel)"],
      ["Ganti layar", "Ganti baterai", "Perbaikan keyboard", "Perbaikan logic board", "Pembersihan dan perawatan", "Instal ulang macOS"],
    ),
  },
];
