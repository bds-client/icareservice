import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { CtaBand } from "@/components/Sections";
import { useSiteContent } from "@/lib/content-context";
import { waLink } from "@/lib/content";

export const Route = createFileRoute("/pricelist")({
  head: () => ({
    meta: [
      { title: "Pricelist Servis iPhone, Apple Watch, iPad & MacBook | iCare Service Denpasar" },
      { name: "description", content: "Daftar harga servis iPhone, Apple Watch, iPad, dan MacBook di iCare Service Denpasar. Pilih perangkat dan jenis servis untuk melihat harga, garansi, dan kualitas sparepart." },
      { property: "og:title", content: "Pricelist Servis | iCare Service Denpasar" },
      { property: "og:description", content: "Harga servis transparan untuk iPhone, Apple Watch, iPad, dan MacBook di Denpasar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricelist,
});

function Pricelist() {
  const { pricelist, general } = useSiteContent();
  const [catIdx, setCatIdx] = useState(0);
  const [svcIdx, setSvcIdx] = useState(0);
  const cat = pricelist[catIdx] ?? pricelist[0];
  const svc = cat?.services[svcIdx] ?? cat?.services[0];
  const rows = svc?.rows ?? [];
  const askPrice = (
    <a href={waLink(general)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
      Hubungi untuk harga <ArrowUpRight className="h-4 w-4" />
    </a>
  );

  return (
    <SiteLayout>
      <PageHero title="Pricelist" crumb="Pricelist" />
      <section className="mx-auto max-w-5xl px-4 py-24">
        <p className="mx-auto max-w-2xl text-center text-muted-foreground">
          Pilih kategori perangkat, lalu pilih jenis servis untuk melihat daftar harga. Harga final dikonfirmasi sebelum pengerjaan dimulai.
        </p>

        <div className="mt-10">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">1. Pilih Perangkat</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {pricelist.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => { setCatIdx(i); setSvcIdx(0); }}
                className={`rounded-full border-2 px-6 py-2.5 font-semibold transition ${
                  i === catIdx ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {cat && (
          <div className="mt-8">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">2. Pilih Jenis Servis</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {cat.services.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSvcIdx(i)}
                  className={`rounded-full border-2 px-6 py-2.5 font-semibold transition ${
                    i === svcIdx ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {svc && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-ink px-6 py-4 text-ink-foreground">
              <h2 className="font-display text-xl font-semibold">{cat?.name} — {svc.name}</h2>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary font-display text-base">
                  <th className="px-6 py-4 font-semibold">Model</th>
                  <th className="px-6 py-4 font-semibold">Garansi / Kualitas</th>
                  <th className="px-6 py-4 font-semibold">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center">{askPrice}</td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={i} className="align-top">
                      <td className="px-6 py-4 font-semibold">{r.model}</td>
                      <td className="px-6 py-4 text-muted-foreground">{r.quality}</td>
                      <td className="px-6 py-4 font-display text-base font-semibold text-primary">
                        {r.price.trim() ? r.price : askPrice}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-8 rounded-2xl bg-secondary p-6 text-sm text-muted-foreground">
          Harga di atas adalah estimasi awal dan dapat berbeda tergantung tipe perangkat serta kualitas sparepart yang Anda pilih. Diagnosis, harga final, ketersediaan sparepart, dan garansi akan dikonfirmasi oleh tim kami sebelum pengerjaan dimulai.
        </p>
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
