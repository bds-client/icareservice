import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { CtaBand, ReviewSources } from "@/components/Sections";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review Pelanggan | iCare Service Denpasar" },
      { name: "description", content: "Baca ulasan asli pelanggan iCare Service Denpasar 1 dan 2 di Google Maps." },
      { property: "og:title", content: "Review Pelanggan iCare Service" },
      { property: "og:description", content: "Testimoni pelanggan berizin dan tautan ulasan asli iCare Service di Google Maps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  return (
    <SiteLayout>
      <PageHero title="Review Pelanggan" crumb="Review" />
      <section className="mx-auto max-w-7xl px-4 py-24">
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Testimoni pelanggan dibagikan dengan izin dan dilengkapi tautan ke ulasan aslinya di Google Maps.
        </p>
        <ReviewSources />
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
