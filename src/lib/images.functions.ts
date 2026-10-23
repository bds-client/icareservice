import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const base = process.env["SUPABASE_URL"]!;
  const client = createClient<Database>(base, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  return { client, base };
}

const PATH_PATTERN = /^[\w][\w./-]{0,200}$/;

export const signImagePaths = createServerFn({ method: "GET" })
  .inputValidator((input: { paths: string[] }) => input)
  .handler(async ({ data }): Promise<Record<string, string>> => {
    const paths = [...new Set(data.paths)].filter((p) => PATH_PATTERN.test(p) && !p.includes("..")).slice(0, 50);
    if (!paths.length) return {};
    const { client, base } = publicClient();
    const { data: signed, error } = await client.storage.from("gallery").createSignedUrls(paths, 3600);
    if (error) throw new Error("Foto belum dapat dimuat. Silakan coba lagi.");
    const out: Record<string, string> = {};
    for (const item of signed ?? []) {
      if (item.path && item.signedUrl) out[item.path] = item.signedUrl.replace(base, import.meta.env["VITE_SUPABASE_URL"]);
    }
    return out;
  });

export interface SiteUpload {
  path: string;
  url: string;
}

export const listSiteUploads = createServerFn({ method: "GET" }).handler(async (): Promise<SiteUpload[]> => {
  const { client, base } = publicClient();
  const { data: files, error } = await client.storage.from("gallery").list("site", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new Error("Daftar foto belum dapat dimuat.");
  const paths = (files ?? []).filter((f) => f.id && PATH_PATTERN.test(f.name)).map((f) => `site/${f.name}`);
  if (!paths.length) return [];
  const { data: signed } = await client.storage.from("gallery").createSignedUrls(paths, 3600);
  return paths.map((path) => ({
    path,
    url: (signed?.find((item) => item.path === path)?.signedUrl ?? "").replace(base, import.meta.env["VITE_SUPABASE_URL"]),
  }));
});
