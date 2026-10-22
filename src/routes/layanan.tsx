import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { CtaBand, ServicesGrid } from "@/components/Sections";

export const Route = createFileRoute("/layanan")({
  head: () => ({
    meta: [
      { title: "Layanan Servis iPhone Denpasar | iCare Service" },
      { name: "description", content: "Konsultasi, diagnosis, penanganan layar dan baterai iPhone di Denpasar." },
      { property: "og:title", content: "Layanan iCare Service" },
      { property: "og:description", content: "Daftar layanan servis iPhone iCare Service di Denpasar." },
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
      <CtaBand />
    </SiteLayout>
  );
}
