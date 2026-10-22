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
