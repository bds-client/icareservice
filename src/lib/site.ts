import screen from "@/assets/svc-screen.jpg";
import battery from "@/assets/svc-battery.jpg";
import diag from "@/assets/svc-diag.jpg";

export const WA_NUMBER = "6289614888888";
export const WA_DISPLAY = "0896-1488-8888";
export const EMAIL = "icareservice.id@gmail.com";
export const HOURS = "Senin–Minggu, 09.00–22.00 WITA";

export function waLink(service?: string) {
  const text = service
    ? `Halo iCare Service, saya ingin bertanya tentang layanan "${service}". Masalah perangkat saya: `
    : "Halo iCare Service, saya ingin konsultasi servis perangkat saya.";
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const branches = [
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
];

export const services = [
  { name: "Konsultasi & Diagnosis", img: diag, desc: "Pemeriksaan kondisi perangkat untuk memahami penyebab masalah sebelum Anda memutuskan penanganan." },
  { name: "Penanganan Layar", img: screen, desc: "Konsultasi untuk layar retak atau bermasalah, dengan penjelasan pilihan kualitas sparepart dan biaya." },
  { name: "Penanganan Baterai", img: battery, desc: "Pengecekan performa baterai dan opsi penggantian sesuai ketersediaan sparepart." },
];

// Harga sementara (placeholder) — konfirmasi akhir oleh tim sebelum pengerjaan.
export const serviceFees = [
  { name: "Konsultasi & Diagnosis", price: "Gratis" },
  { name: "Jasa Ganti Layar", price: "Rp 150.000" },
  { name: "Jasa Ganti Baterai", price: "Rp 100.000" },
  { name: "Jasa Ganti Kamera", price: "Rp 150.000" },
  { name: "Jasa Perbaikan Charging Port", price: "Rp 150.000" },
  { name: "Jasa Perbaikan Software / Restore", price: "Rp 100.000" },
];

export const sparepartPrices = [
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
];
