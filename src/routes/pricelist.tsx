import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Check, Clock3, Laptop, ShieldCheck, Smartphone, Watch, Wrench } from "lucide-react";
import { PageHero, SiteLayout, WaButton } from "@/components/SiteLayout";
import { useSiteContent } from "@/lib/content-context";

export const Route = createFileRoute("/pricelist")({
  head: () => ({
    meta: [
      { title: "Pricelist Servis Apple | iCare Service Denpasar" },
      { name: "description", content: "Lihat pilihan model, jenis servis, sparepart, ongkos pasang, estimasi waktu, dan garansi iCare Service." },
    ],
  }),
  component: Pricelist,
});

function Pricelist() {
  const { pricelist } = useSiteContent();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const activeCategory = pricelist.find((category) => category.id === categoryId);
  const activeModel = activeCategory?.models.find((item) => item.name === model);
  const activeService = activeModel?.services.find((service) => service.name === serviceName) ?? activeModel?.services[0];

  useEffect(() => {
    if (activeCategory) detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeCategory]);

  function chooseCategory(id: string) {
    setCategoryId(id);
    setModel(null);
    setServiceName(null);
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
          {pricelist.map(({ id, name, description }) => {
            const selected = categoryId === id;
            const Icon = id === "watch" ? Watch : id === "macbook" ? Laptop : Smartphone;
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
          <div ref={detailsRef} className="mt-12 scroll-mt-8 rounded-3xl border bg-card p-5 shadow-sm md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Pricelist {activeCategory.name}</p><h3 className="mt-1 text-2xl font-bold">Pilih model perangkat</h3></div>
              <p className="text-sm text-muted-foreground">Harga sementara ditampilkan sebagai konsultasi langsung.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {activeCategory.models.map((item) => (
                <button key={item.name} type="button" onClick={() => { setModel(item.name); setServiceName(item.services[0]?.name ?? null); }} aria-pressed={model === item.name}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${model === item.name ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary hover:text-primary"}`}>
                  {item.name}
                </button>
              ))}
            </div>

            {activeModel && (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border bg-background p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4"><div><p className="text-sm text-muted-foreground">Estimasi servis untuk</p><h4 className="mt-1 text-xl font-bold">{activeModel.name}</h4></div></div>
                  <h5 className="mb-3 mt-5 font-semibold">Jenis service</h5>
                  <div className="divide-y rounded-xl border">
                    {activeModel.services.map((service) => <button key={service.name} type="button" onClick={() => setServiceName(service.name)} aria-pressed={activeService?.name === service.name} className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left ${activeService?.name === service.name ? "bg-primary/5" : "hover:bg-secondary"}`}><span className="text-sm">{service.name}</span><span className="shrink-0 text-sm font-semibold text-primary">{service.price || "Hubungi untuk harga"}</span></button>)}
                  </div>
                  {activeService && <p className="mt-3 text-sm text-muted-foreground">Harga bersifat estimasi dan dikonfirmasi setelah pemeriksaan perangkat.</p>}
                </div>
                <aside className="space-y-4">
                  <div className="rounded-2xl border bg-background p-5">
                    <h5 className="font-semibold">Pilihan sparepart</h5>
                    <ul className="mt-3 space-y-2">{(activeService?.parts ?? "").split(/\n|,/).map((part) => part.trim()).filter(Boolean).map((part) => <li key={part} className="flex items-center gap-2 text-sm text-muted-foreground"><BadgeCheck className="h-4 w-4 shrink-0 text-primary" />{part}</li>)}</ul>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border bg-background p-4"><Wrench className="h-5 w-5 text-primary" /><p className="mt-3 text-sm text-muted-foreground">Ongkos pasang</p><p className="font-semibold">{activeService?.installCost || "Gratis"}</p></div>
                    <div className="rounded-2xl border bg-background p-4"><Clock3 className="h-5 w-5 text-primary" /><p className="mt-3 text-sm text-muted-foreground">Estimasi waktu</p><p className="font-semibold">{activeService?.estimate || "Konfirmasi teknisi"}</p></div>
                    <div className="col-span-2 rounded-2xl border bg-background p-4"><ShieldCheck className="h-5 w-5 text-primary" /><p className="mt-3 text-sm text-muted-foreground">Garansi</p><p className="font-semibold">{activeService?.warranty || "Dikonfirmasi sebelum pengerjaan"}</p></div>
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
