import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { CtaBand } from "@/components/Sections";
import { useSiteContent } from "@/lib/content-context";

const priceTiers = [
  { id: "12", heading: "Garansi", duration: "12 Bulan", quality: "Kualitas FHD" },
  { id: "18", heading: "Garansi", duration: "18 Bulan", quality: "Kualitas OLED" },
  { id: "36", heading: "Garansi", duration: "36 Bulan", quality: "Original" },
] as const;

export const Route = createFileRoute("/pricelist")({
  head: () => ({
    meta: [
      { title: "Pricelist LCD & Baterai iPhone | iCare Service Denpasar" },
      { name: "description", content: "Lihat harga servis LCD dan baterai iPhone berdasarkan model dan pilihan kualitas garansi." },
    ],
  }),
  component: Pricelist,
});

function Pricelist() {
  const { pricelist } = useSiteContent();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const iphone = pricelist.find((category) => category.name.toLowerCase() === "iphone");
  const service = iphone?.services.find((item) => item.name === selectedService);
  const grouped = new Map<string, Record<string, string>>();

  for (const row of service?.rows ?? []) {
    const values = grouped.get(row.model) ?? {};
    const tier = priceTiers.find((item) => row.quality.toLowerCase().includes(item.id));
    if (tier) values[tier.id] = row.price || "-";
    grouped.set(row.model, values);
  }

  return (
    <SiteLayout>
      <PageHero title="Pricelist Servis iPhone" crumb="Pricelist" />
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-[#3b2418] md:text-4xl">Pilih Jenis Service</h2>
          <p className="mt-3 text-[#604b3c]">Pilih LCD atau baterai untuk melihat harga berdasarkan model dan kualitas sparepart.</p>
        </div>

        <div className="mb-8 flex justify-center gap-3" role="group" aria-label="Pilih jenis service">
          {["LCD", "Baterai"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedService(name)}
              aria-pressed={selectedService === name}
              className={
                selectedService === name
                  ? "rounded-full border-2 border-[#3b2418] bg-[#3b2418] px-7 py-3 font-bold text-[#f2ecdf]"
                  : "rounded-full border-2 border-[#3b2418] bg-transparent px-7 py-3 font-bold text-[#3b2418] hover:bg-[#e5dccb]"
              }
            >
              {name}
            </button>
          ))}
        </div>

        {selectedService && (
          <div className="overflow-hidden rounded-[1.5rem] border-[3px] border-[#3b2418] bg-[#f0ebdf] p-2 shadow-xl md:p-3">
            <div className="overflow-x-auto rounded-[1rem]">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-1 text-left text-sm text-[#3b2418] md:text-base">
                <thead>
                  <tr className="bg-[#3b2418] text-[#f4eee2]">
                    <th scope="col" className="rounded-l-xl px-4 py-4 font-bold md:px-5">Model iPhone</th>
                    {priceTiers.map((tier) => (
                      <th key={tier.id} scope="col" className="border-l border-[#d4c5ad]/70 px-3 py-3 text-center md:px-5">
                        <span className="block font-semibold">{tier.heading}</span>
                        <span className="block font-bold">{tier.duration}</span>
                        <span className="block text-xs font-normal opacity-85">{tier.quality}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...grouped.entries()].map(([model, prices]) => (
                    <tr key={model}>
                      <th scope="row" className="whitespace-nowrap px-4 py-2.5 font-bold md:px-5">{model}</th>
                      {priceTiers.map((tier) => (
                        <td key={tier.id} className="px-3 py-2.5 text-center md:px-5">
                          <span className="inline-flex min-w-24 justify-center rounded-full border border-[#5a4030] px-4 py-1.5 font-bold">
                            {prices[tier.id] || "-"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                  {grouped.size === 0 && (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-[#604b3c]">Harga akan segera tersedia.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="px-3 pb-2 pt-4 text-xs text-[#604b3c]">Harga mengikuti pilihan kualitas dan garansi. Geser tabel ke samping pada layar kecil untuk melihat semua kolom.</p>
          </div>
        )}
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
