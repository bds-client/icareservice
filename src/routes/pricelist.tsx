import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BadgeCheck, Check, Clock3, Laptop, ShieldCheck, Smartphone, Watch, Wrench } from "lucide-react";
import { PageHero, SiteLayout, WaButton } from "@/components/SiteLayout";

export const Route = createFileRoute("/pricelist")({
  head: () => ({
    meta: [
      { title: "Pricelist Servis Apple | iCare Service Denpasar" },
      { name: "description", content: "Lihat pilihan model, jenis servis, sparepart, ongkos pasang, estimasi waktu, dan garansi iCare Service." },
    ],
  }),
  component: Pricelist,
});

const categories = [
  { id: "iphone", name: "iPhone", Icon: Smartphone, description: "Servis layar, baterai, kamera, dan lainnya.", models: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 12 Series", "iPhone 11 Series", "iPhone X Series", "iPhone 8 Series"], services: ["Ganti layar", "Ganti baterai", "Ganti kamera", "Perbaikan charging", "Perbaikan speaker", "Perbaikan software"], parts: ["OEM / kompatibel", "Original copotan", "Original service pack"] },
  { id: "watch", name: "Apple Watch", Icon: Watch, description: "Pemeriksaan dan perbaikan Apple Watch.", models: ["Apple Watch Ultra 2", "Apple Watch Ultra", "Apple Watch Series 10", "Apple Watch Series 9", "Apple Watch Series 8", "Apple Watch Series 7", "Apple Watch SE (Gen 2)", "Apple Watch SE"], services: ["Ganti layar", "Ganti baterai", "Perbaikan crown / tombol", "Pemeriksaan unit"], parts: ["Kompatibel", "Original copotan"] },
  { id: "ipad", name: "iPad", Icon: Smartphone, description: "Servis iPad untuk kebutuhan kerja dan harian.", models: ["iPad Pro 13-inch (M4)", "iPad Pro 11-inch (M4)", "iPad Pro 12.9-inch", "iPad Pro 11-inch", "iPad Air 13-inch", "iPad Air 11-inch", "iPad Air", "iPad mini", "iPad"], services: ["Ganti layar / LCD", "Ganti baterai", "Perbaikan charging", "Perbaikan kamera", "Perbaikan software"], parts: ["OEM / kompatibel", "Original copotan", "Original service pack"] },
  { id: "macbook", name: "MacBook", Icon: Laptop, description: "Pemeriksaan dan servis MacBook.", models: ["MacBook Pro 16-inch (Apple silicon)", "MacBook Pro 14-inch (Apple silicon)", "MacBook Pro 13-inch", "MacBook Air 15-inch", "MacBook Air 13-inch", "MacBook Air (Intel)"], services: ["Ganti layar", "Ganti baterai", "Perbaikan keyboard", "Perbaikan logic board", "Pembersihan dan perawatan", "Instal ulang macOS"], parts: ["Kompatibel", "Original copotan", "Original service pack"] },
] as const;

function Pricelist() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const activeCategory = categories.find((category) => category.id === categoryId);

  function chooseCategory(id: string) {
    setCategoryId(id);
    setModel(null);
  }

  return (
    <SiteLayout>
      <PageHero title="Pricelist Servis Apple" crumb="Pricelist" />
      <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"><Wrench className="h-4 w-4" /> Pilih perangkat Anda</span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">Harga servis, jelas dari awal</h2>
          <p className="mt-3 text-muted-foreground">Pilih kategori dan model untuk melihat jenis servis serta pilihan sparepart. Harga final dikonfirmasi tim kami setelah pengecekan.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ id, name, Icon, description }) => {
            const selected = categoryId === id;
            return (
              <button key={id} type="button" onClick={() => chooseCategory(id)} aria-pressed={selected}
                className={`group min-h-52 rounded-3xl border p-6 text-left shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:shadow-xl ${selected ? "border-primary bg-white/95 ring-2 ring-primary/20" : "border-white/80 bg-white/75 hover:border-primary/40"}`}>
                <span className={`mb-8 grid h-14 w-14 place-items-center rounded-2xl transition ${selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"}`}><Icon className="h-7 w-7" /></span>
                <span className="flex items-center justify-between font-display text-2xl font-bold">{name}{selected ? <Check className="h-5 w-5 text-primary" /> : <ArrowRight className="h-5 w-5 opacity-40 transition group-hover:translate-x-1" />}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{description}</span>
              </button>
            );
          })}
        </div>

        {activeCategory && (
          <div className="mt-12 scroll-mt-8 rounded-3xl border bg-card p-5 shadow-sm md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Pricelist {activeCategory.name}</p><h3 className="mt-1 text-2xl font-bold">Pilih model perangkat</h3></div>
              <p className="text-sm text-muted-foreground">Harga sementara ditampilkan sebagai konsultasi langsung.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {activeCategory.models.map((item) => (
                <button key={item} type="button" onClick={() => setModel(item)} aria-pressed={model === item}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${model === item ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary hover:text-primary"}`}>
                  {item}
                </button>
              ))}
            </div>

            {model && (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border bg-background p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4"><div><p className="text-sm text-muted-foreground">Estimasi servis untuk</p><h4 className="mt-1 text-xl font-bold">{model}</h4></div><span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Hubungi untuk harga</span></div>
                  <h5 className="mb-3 mt-5 font-semibold">Jenis service</h5>
                  <div className="divide-y rounded-xl border">
                    {activeCategory.services.map((service) => <div key={service} className="flex items-center justify-between gap-4 px-4 py-3"><span className="text-sm">{service}</span><span className="shrink-0 text-sm font-semibold text-primary">Hubungi kami</span></div>)}
                  </div>
                </div>
                <aside className="space-y-4">
                  <div className="rounded-2xl border bg-background p-5">
                    <h5 className="font-semibold">Pilihan sparepart</h5>
                    <ul className="mt-3 space-y-2">{activeCategory.parts.map((part) => <li key={part} className="flex items-center gap-2 text-sm text-muted-foreground"><BadgeCheck className="h-4 w-4 shrink-0 text-primary" />{part}</li>)}</ul>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border bg-background p-4"><Wrench className="h-5 w-5 text-primary" /><p className="mt-3 text-sm text-muted-foreground">Ongkos pasang</p><p className="font-semibold">Gratis</p></div>
                    <div className="rounded-2xl border bg-background p-4"><Clock3 className="h-5 w-5 text-primary" /><p className="mt-3 text-sm text-muted-foreground">Estimasi waktu</p><p className="font-semibold">Konfirmasi teknisi</p></div>
                    <div className="col-span-2 rounded-2xl border bg-background p-4"><ShieldCheck className="h-5 w-5 text-primary" /><p className="mt-3 text-sm text-muted-foreground">Garansi</p><p className="font-semibold">Dijelaskan sebelum pengerjaan</p></div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-secondary p-5 text-sm text-muted-foreground md:p-6">
          Pricelist ini adalah panduan awal. Harga servis berbeda menurut model dan kondisi unit; ketersediaan sparepart, estimasi pengerjaan, dan ketentuan garansi dikonfirmasi oleh tim sebelum servis dimulai.
        </div>
        <div className="mt-8 text-center"><WaButton service={model ? `Tanya pricelist ${model}` : "Tanya pricelist servis Apple"}>Tanya Pricelist via WhatsApp</WaButton></div>
      </section>
    </SiteLayout>
  );
}
