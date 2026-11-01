import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { CtaBand } from "@/components/Sections";
import { useSiteContent } from "@/lib/content-context";

export const Route = createFileRoute("/pricelist")({
  head: () => ({
    meta: [
      { title: "Pricelist Servis iPhone | iCare Service Denpasar" },
      { name: "description", content: "Lihat harga servis iPhone berdasarkan jenis servis dan model perangkat." },
    ],
  }),
  component: Pricelist,
});

function Pricelist() {
  const { pricelist } = useSiteContent();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const iphone = pricelist.find((category) => category.name.toLowerCase() === "iphone");
  const services = iphone?.services ?? [];
  const service = services.find((item) => item.name === selectedService);
  const columns = [...new Set((service?.rows ?? []).map((row) => row.quality).filter(Boolean))];
  const grouped = new Map<string, Map<string, string>>();

  for (const row of service?.rows ?? []) {
    const values = grouped.get(row.model) ?? new Map<string, string>();
    values.set(row.quality, row.price || "-");
    grouped.set(row.model, values);
  }

  return (
    <SiteLayout>
      <PageHero title="Pricelist Servis iPhone" crumb="Pricelist" />
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-[#111111] md:text-4xl">Pilih Jenis Service</h2>
          <p className="mt-3 text-[#666666]">Pilih jenis servis untuk melihat pilihan dan harga berdasarkan model iPhone.</p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3" role="group" aria-label="Pilih jenis service">
          {services.map(({ name }) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedService(name)}
              aria-pressed={selectedService === name}
              className={
                selectedService === name
                  ? "rounded-full border-2 border-[#111111] bg-[#111111] px-6 py-3 font-bold text-white"
                  : "rounded-full border-2 border-[#111111] bg-white px-6 py-3 font-bold text-[#111111] hover:bg-[#f0f0f0]"
              }
            >
              {name}
            </button>
          ))}
        </div>

        {selectedService && (
          <>
            <p className="mb-2 px-1 text-xs text-[#666666] md:hidden">Geser tabel ke samping untuk melihat semua kolom.</p>
            <div className="overflow-hidden rounded-[1.5rem] border-[3px] border-[#111111] bg-white p-2 shadow-xl md:p-3">
              <div className="overflow-x-auto rounded-[1rem]">
                <table className="w-full min-w-max border-separate border-spacing-y-1 text-left text-sm text-[#111111] md:text-base">
                  <thead>
                    <tr className="bg-[#111111] text-white">
                      <th scope="col" className="rounded-l-xl px-4 py-4 font-bold md:px-5">Model iPhone</th>
                      {columns.map((column) => (
                        <th key={column} scope="col" className="border-l border-white/25 px-4 py-3 text-center md:px-5">
                          {column.split(" · ").map((part, index) => (
                            <span key={part} className={index === 0 ? "block font-bold" : "block text-xs font-normal opacity-85"}>{part}</span>
                          ))}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...grouped.entries()].map(([model, prices]) => (
                      <tr key={model}>
                        <th scope="row" className="whitespace-nowrap px-4 py-2.5 font-bold md:px-5">{model}</th>
                        {columns.map((column) => (
                          <td key={column} className="whitespace-nowrap px-3 py-2.5 text-center md:px-5">
                            <span className="inline-flex min-w-24 justify-center rounded-full border border-[#555555] px-4 py-1.5 font-bold">
                              {prices.get(column) || "-"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                    {grouped.size === 0 && (
                      <tr><td colSpan={Math.max(columns.length + 1, 1)} className="px-5 py-8 text-center text-[#666666]">Harga akan segera tersedia.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
