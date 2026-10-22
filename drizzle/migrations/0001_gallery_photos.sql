CREATE TABLE public.gallery_photos (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 path text NOT NULL UNIQUE,
 title text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_photos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery public read" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gallery editors insert" ON public.gallery_photos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Gallery editors delete" ON public.gallery_photos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Gallery public image read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Gallery editors upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND lower(storage.extension(name)) IN ('jpg','jpeg','png','webp') AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')));
CREATE POLICY "Gallery editors remove" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')));