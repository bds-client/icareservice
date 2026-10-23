import { useQuery } from "@tanstack/react-query";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import svcDiag from "@/assets/svc-diag.jpg";
import svcScreen from "@/assets/svc-screen.jpg";
import svcBattery from "@/assets/svc-battery.jpg";
import { useSiteContent } from "./content-context";
import { signImagePaths } from "./images.functions";

export const ASSET_IMAGES: Record<string, string> = {
  hero: heroImg,
  about: aboutImg,
  "svc-diag": svcDiag,
  "svc-screen": svcScreen,
  "svc-battery": svcBattery,
};

export const ASSET_IMAGE_LABELS: Record<string, string> = {
  "asset:hero": "Foto bawaan: Beranda",
  "asset:about": "Foto bawaan: Tentang",
  "asset:svc-diag": "Foto bawaan: Layanan Diagnosis",
  "asset:svc-screen": "Foto bawaan: Layanan Layar",
  "asset:svc-battery": "Foto bawaan: Layanan Baterai",
};

function refPath(ref: string): string | null {
  if (ref.startsWith("gallery:")) return ref.slice("gallery:".length);
  if (ref.startsWith("site:")) return `site/${ref.slice("site:".length)}`;
  return null;
}

export interface ResolvedImages {
  hero: string;
  about: string;
  services: string[];
}

export function useSiteImages(): ResolvedImages {
  const { images } = useSiteContent();
  const refs = [images.hero, images.about, ...images.services];
  const paths = refs.map(refPath).filter((p): p is string => p !== null);
  const { data: signed } = useQuery({
    queryKey: ["site-image-urls", ...paths],
    queryFn: () => signImagePaths({ data: { paths } }),
    staleTime: 3_000_000,
    enabled: paths.length > 0,
  });
  const resolve = (ref: string): string => {
    const path = refPath(ref);
    if (path === null) return ASSET_IMAGES[ref.slice(6)] ?? heroImg;
    return signed?.[path] ?? "";
  };
  return {
    hero: resolve(images.hero),
    about: resolve(images.about),
    services: images.services.map(resolve),
  };
}
