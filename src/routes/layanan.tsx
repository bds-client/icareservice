import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { CtaBand, PriceTables, ServicesGrid } from "@/components/Sections";
import { Eyebrow } from "@/components/SiteLayout";

export const Route = createFileRoute("/layanan")({
  head: () => ({
    meta: [
      { title: "Layanan Servis iPhone Denpasar | iCare Service" },
      { name: "description", content: "Konsultasi, diagnosis, penanganan layar dan baterai iPhone di Denpasar." },
      { property: "og:title", content: "Layanan iCare Service" },
      { property: "og:description", content: "Daftar layanan servis iPhone iCare Service di Denpasar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <SiteLayout>
      <PageHero title="Layanan Kami" crumb="Layanan" />
      <section className="mx-auto max-w-7xl px-4 py-24">
        <ServicesGrid />
        <p className="mt-10 rounded-2xl bg-secondary p-6 text-sm text-muted-foreground">
          Diagnosis, harga, ketersediaan sparepart, dan garansi akan dikonfirmasi oleh tim kami sebelum pengerjaan dimulai.
        </p>
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <Eyebrow>Biaya</Eyebrow>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">Biaya Servis & Harga Sparepart</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Harga di bawah adalah estimasi awal. Harga final tergantung tipe perangkat dan kualitas sparepart yang Anda pilih, dan akan dikonfirmasi sebelum pengerjaan.
            </p>
          </div>
          <PriceTables />
        </div>
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
