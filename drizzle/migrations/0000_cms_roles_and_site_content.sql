create type public.app_role as enum ('admin', 'staff');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can read own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create policy "Admins can manage roles"
on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Pengguna pertama yang mendaftar otomatis menjadi admin
create or replace function public.handle_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_first_admin
  after insert on auth.users
  for each row execute function public.handle_first_admin();

create table public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;

create policy "Konten dapat dibaca publik"
on public.site_content for select to anon, authenticated
using (true);

create policy "Admin dan staff dapat menambah konten"
on public.site_content for insert to authenticated
with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'));

create policy "Admin dan staff dapat mengubah konten"
on public.site_content for update to authenticated
using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'))
with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'));

create policy "Hanya admin dapat menghapus konten"
on public.site_content for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

insert into public.site_content (key, value) values
('general', '{"waNumber":"6289614888888","waDisplay":"0896-1488-8888","email":"icareservice.id@gmail.com","hours":"Senin–Minggu, 09.00–22.00 WITA"}'),
('hero', '{"title":"Servis iPhone dengan Pilihan yang Jelas dan Transparan","subtitle":"iCare Service membantu Anda memahami pilihan penanganan, kualitas sparepart, dan biaya sebelum memutuskan servis.","branchesLine":"Jl. Teuku Umar No.199 & No.38 · Buka setiap hari 09.00–22.00 WITA","stat1Value":"1998","stat1Label":"Berpengalaman","stat2Value":"7/7","stat2Label":"Hari Buka"}'),
('trust', '[{"t":"Sejak 1998","d":"Bagian dari Putra Mahkota Group"},{"t":"Transparan","d":"Pilihan kualitas dijelaskan terbuka"},{"t":"Cermat","d":"Penanganan perangkat dengan teliti"},{"t":"Pascaservis","d":"Dukungan sesuai ketentuan"}]'),
('about', '{"title":"Servis independen yang mengutamakan kejelasan","body":"iCare Service berfokus pada iPhone dan produk Apple lainnya sesuai kemampuan layanan. Dikembangkan dari Putra Mahkota Group, kami menjelaskan setiap pilihan sebelum perangkat Anda dikerjakan.","points":["Diagnosis dan estimasi dijelaskan sebelum pengerjaan","Pilihan kualitas sparepart yang terbuka","Komunikasi selama proses servis"]}'),
('services', '[{"name":"Konsultasi & Diagnosis","desc":"Pemeriksaan kondisi perangkat untuk memahami penyebab masalah sebelum Anda memutuskan penanganan."},{"name":"Penanganan Layar","desc":"Konsultasi untuk layar retak atau bermasalah, dengan penjelasan pilihan kualitas sparepart dan biaya."},{"name":"Penanganan Baterai","desc":"Pengecekan performa baterai dan opsi penggantian sesuai ketersediaan sparepart."}]'),
('serviceFees', '[{"name":"Konsultasi & Diagnosis","price":"Gratis"},{"name":"Jasa Ganti Layar","price":"Rp 150.000"},{"name":"Jasa Ganti Baterai","price":"Rp 100.000"},{"name":"Jasa Ganti Kamera","price":"Rp 150.000"},{"name":"Jasa Perbaikan Charging Port","price":"Rp 150.000"},{"name":"Jasa Perbaikan Software / Restore","price":"Rp 100.000"}]'),
('sparepartPrices', '[{"part":"Layar iPhone (OEM)","price":"Rp 850.000"},{"part":"Layar iPhone (Original)","price":"Rp 1.500.000"},{"part":"Baterai iPhone (OEM)","price":"Rp 350.000"},{"part":"Baterai iPhone (Original)","price":"Rp 650.000"},{"part":"Kamera Belakang","price":"Rp 750.000"},{"part":"Kamera Depan","price":"Rp 450.000"},{"part":"Charging Port","price":"Rp 400.000"},{"part":"Backglass / Casing Belakang","price":"Rp 550.000"},{"part":"Speaker / Ear Speaker","price":"Rp 300.000"},{"part":"Tombol Home / Power","price":"Rp 250.000"}]'),
('branches', '[{"name":"iCare Service Denpasar 1","address":"Jl. Teuku Umar No.199, Dauh Puri Klod, Denpasar Barat, Bali 80114","maps":"https://maps.app.goo.gl/LkiRVzHwFpcpLyRh8"},{"name":"iCare Service Denpasar 2","address":"Jl. Teuku Umar No.38, Dauh Puri Klod, Denpasar Barat, Bali 80113","maps":"https://maps.app.goo.gl/6yW9jdDC3AKouyoM9"}]'),
('cta', '{"title":"Perangkat bermasalah?","body":"Ceritakan kendala Anda. Tim kami jelaskan pilihan penanganan, kualitas sparepart, dan biaya sebelum servis."}');