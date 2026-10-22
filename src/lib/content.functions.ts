import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { defaultContent, type ContentKey, type SiteContent } from "./content";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  const { data } = await publicClient().from("site_content").select("key, value");
  const merged: Record<string, unknown> = { ...defaultContent };
  for (const row of data ?? []) {
    merged[row.key as string] = row.value;
  }
  return merged as unknown as SiteContent;
});

async function canEdit(supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> }, userId: string) {
  const [admin, staff] = await Promise.all([
    supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
    supabase.rpc("has_role", { _user_id: userId, _role: "staff" }),
  ]);
  return Boolean(admin.data) || Boolean(staff.data);
}

export const saveSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: ContentKey; value: unknown }) => input)
  .handler(async ({ data, context }) => {
    if (!(await canEdit(context.supabase, context.userId))) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("site_content")
      .upsert({ key: data.key, value: data.value as never, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    return (data ?? []).map((r) => r.role as string);
  });

async function requireAdmin(supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> }, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export interface TeamUser {
  id: string;
  email: string;
  roles: string[];
}

export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TeamUser[]> => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw new Error(error.message);
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    return users.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      roles: (roles ?? []).filter((r) => r.user_id === u.id).map((r) => r.role as string),
    }));
  });

export const createTeamUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; password: string; role: "admin" | "staff" }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: data.role });
    if (roleError) throw new Error(roleError.message);
    return { ok: true };
  });

export const setTeamRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: "admin" | "staff"; enabled: boolean }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.enabled) {
      const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: data.role });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteTeamUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("Tidak bisa menghapus akun sendiri");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
