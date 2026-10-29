import type { Testimonial } from "./testimonials";
import { defaultImages, type ImagesContent } from "./image-refs";
import { defaultPricelist, type PricelistCategory } from "./pricelist";

export interface GeneralContent {
  waNumber: string;
  waDisplay: string;
  email: string;
  hours: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  branchesLine: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

export interface TrustItem {
  t: string;
  d: string;
}

export interface AboutContent {
  title: string;
  body: string;
  points: string[];
}

export interface PrincipleItem {
  t: string;
  d: string;
}

export interface TentangContent {
  pageTitle: string;
  pageCrumb: string;
  eyebrow: string;
  title: string;
  body: string;
  vision: string;
  mission: string;
  principlesTitle: string;
  principles: PrincipleItem[];
}

export interface ServiceItem {
  name: string;
  desc: string;
}

export interface FeeItem {
  name: string;
  price: string;
}

export interface PartItem {
  part: string;
  price: string;
}

export interface BranchItem {
  name: string;
  address: string;
  maps: string;
}

export interface CtaContent {
  title: string;
  body: string;
}

export interface SiteContent {
  general: GeneralContent;
  hero: HeroContent;
  trust: TrustItem[];
  about: AboutContent;
  tentang: TentangContent;
  services: ServiceItem[];
  serviceFees: FeeItem[];
  sparepartPrices: PartItem[];
  branches: BranchItem[];
  cta: CtaContent;
  testimonials: Testimonial[];
  images: ImagesContent;
  pricelist: PricelistCategory[];
}

export type ContentKey = keyof SiteContent;

export const defaultContent: SiteContent = {
  testimonials: [],
  images: defaultImages,
  pricelist: defaultPricelist,
  general: {
    waNumber: "6289614888888",
    waDisplay: "0896-1488-8888",
    email: "icareservice.id@gmail.com",
    hours: "Senin–Minggu, 09.00–22.00 WITA",
  },
  hero: {
    title: "Servis iPhone dengan Pilihan yang Jelas dan Transparan",
    subtitle:
      "iCare Service membantu Anda memahami pilihan penanganan, kualitas sparepart, dan biaya sebelum memutuskan servis.",
    branchesLine: "Jl. Teuku Umar No.199 & No.38 · Buka setiap hari 09.00–22.00 WITA",
    stat1Value: "1998",
    stat1Label: "Berpengalaman",
    stat2Value: "7/7",
    stat2Label: "Hari Buka",
  },
  trust: [
    { t: "Sejak 1998", d: "Bagian dari Putra Mahkota Group" },
    { t: "Transparan", d: "Pilihan kualitas dijelaskan terbuka" },
    { t: "Cermat", d: "Penanganan perangkat dengan teliti" },
    { t: "Pascaservis", d: "Dukungan sesuai ketentuan" },
  ],
  about: {
    title: "Servis independen yang mengutamakan kejelasan",
    body: "iCare Service berfokus pada iPhone dan produk Apple lainnya sesuai kemampuan layanan. Dikembangkan dari Putra Mahkota Group, kami menjelaskan setiap pilihan sebelum perangkat Anda dikerjakan.",
    points: [
      "Diagnosis dan estimasi dijelaskan sebelum pengerjaan",
      "Pilihan kualitas sparepart yang terbuka",
      "Komunikasi selama proses servis",
    ],
  },
  tentang: {
    pageTitle: "Tentang iCare",
    pageCrumb: "Tentang",
    eyebrow: "Profil",
    title: "Layanan servis independen dari Putra Mahkota Group",
    body: "iCare Service adalah layanan servis independen yang berfokus pada iPhone dan produk Apple lainnya sesuai kemampuan layanan. Brand iCare dikembangkan dari Putra Mahkota Group yang telah berdiri sejak 1998.",
    vision: "Menjadi tempat servis perangkat yang dipercaya karena kejelasan dan kualitas layanannya.",
    mission: "Memberikan informasi yang terbuka, penanganan yang cermat, dan dukungan setelah servis.",
    principlesTitle: "Prinsip Layanan Kami",
    principles: [
      { t: "Transparansi", d: "Pilihan penanganan, kualitas sparepart, dan biaya dijelaskan sebelum pengerjaan." },
      { t: "Penanganan Cermat", d: "Setiap perangkat ditangani dengan teliti dan hati-hati." },
      { t: "Komunikasi", d: "Kami memberi kabar selama proses servis berlangsung." },
      { t: "Dukungan Pascaservis", d: "Bantuan setelah servis sesuai ketentuan yang berlaku." },
    ],
  },
  services: [
    {
      name: "Konsultasi & Diagnosis",
      desc: "Pemeriksaan kondisi perangkat untuk memahami penyebab masalah sebelum Anda memutuskan penanganan.",
    },
    {
      name: "Penanganan Layar",
      desc: "Konsultasi untuk layar retak atau bermasalah, dengan penjelasan pilihan kualitas sparepart dan biaya.",
    },
    {
      name: "Penanganan Baterai",
      desc: "Pengecekan performa baterai dan opsi penggantian sesuai ketersediaan sparepart.",
    },
  ],
  serviceFees: [
    { name: "Konsultasi & Diagnosis", price: "Gratis" },
    { name: "Jasa Ganti Layar", price: "Rp 150.000" },
    { name: "Jasa Ganti Baterai", price: "Rp 100.000" },
    { name: "Jasa Ganti Kamera", price: "Rp 150.000" },
    { name: "Jasa Perbaikan Charging Port", price: "Rp 150.000" },
    { name: "Jasa Perbaikan Software / Restore", price: "Rp 100.000" },
  ],
  sparepartPrices: [
    { part: "Layar iPhone (OEM)", price: "Rp 850.000" },
    { part: "Layar iPhone (Original)", price: "Rp 1.500.000" },
    { part: "Baterai iPhone (OEM)", price: "Rp 350.000" },
    { part: "Baterai iPhone (Original)", price: "Rp 650.000" },
    { part: "Kamera Belakang", price: "Rp 750.000" },
    { part: "Kamera Depan", price: "Rp 450.000" },
    { part: "Charging Port", price: "Rp 400.000" },
    { part: "Backglass / Casing Belakang", price: "Rp 550.000" },
    { part: "Speaker / Ear Speaker", price: "Rp 300.000" },
    { part: "Tombol Home / Power", price: "Rp 250.000" },
  ],
  branches: [
    {
      name: "iCare Service Denpasar 1",
      address: "Jl. Teuku Umar No.199, Dauh Puri Klod, Denpasar Barat, Bali 80114",
      maps: "https://maps.app.goo.gl/LkiRVzHwFpcpLyRh8",
    },
    {
      name: "iCare Service Denpasar 2",
      address: "Jl. Teuku Umar No.38, Dauh Puri Klod, Denpasar Barat, Bali 80113",
      maps: "https://maps.app.goo.gl/6yW9jdDC3AKouyoM9",
    },
  ],
  cta: {
    title: "Perangkat bermasalah?",
    body: "Ceritakan kendala Anda. Tim kami jelaskan pilihan penanganan, kualitas sparepart, dan biaya sebelum servis.",
  },
};

export function waLink(general: GeneralContent, service?: string) {
  const text = service
    ? `Halo iCare Service, saya ingin bertanya tentang layanan "${service}". Masalah perangkat saya: `
    : "Halo iCare Service, saya ingin konsultasi servis perangkat saya.";
  return `https://wa.me/${general.waNumber}?text=${encodeURIComponent(text)}`;
}
