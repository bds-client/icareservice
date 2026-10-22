import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const base = process.env["SUPABASE_URL"]!;
  const client = createClient<Database>(base, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from("gallery_photos").select("id,path,title").order("created_at", { ascending: false });
  if (error) throw new Error("Galeri belum dapat dimuat. Silakan coba lagi.");
  if (!data.length) return [];
  const { data: signed, error: signingError } = await client.storage.from("gallery").createSignedUrls(data.map((photo) => photo.path), 3600);
  if (signingError) throw new Error("Foto belum dapat dimuat. Silakan coba lagi.");
  return data.map((photo) => ({ ...photo, url: (signed?.find((item) => item.path === photo.path)?.signedUrl ?? "").replace(base, import.meta.env["VITE_SUPABASE_URL"]) }));
});