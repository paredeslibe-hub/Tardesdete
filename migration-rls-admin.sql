-- ============================================================
-- MIGRACIÓN: Refuerzo de RLS — solo rol 'admin' puede escribir
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- Helper: auth.is_admin()
-- Lee el campo 'role' de app_metadata en el JWT.
-- Para activarlo: Dashboard > Authentication > Users >
--   seleccioná el usuario > Edit > App Metadata:
--   {"role": "admin"}
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  )
$$;


-- ============================================================
-- TABLA: productos
-- ============================================================

DROP POLICY IF EXISTS "Insertar productos (autenticado)"   ON public.productos;
DROP POLICY IF EXISTS "Actualizar productos (autenticado)" ON public.productos;
DROP POLICY IF EXISTS "Eliminar productos (autenticado)"   ON public.productos;

-- Lectura pública se mantiene igual (catálogo visible)

CREATE POLICY "Insertar productos (admin)"
  ON public.productos
  FOR INSERT
  WITH CHECK (auth.is_admin());

CREATE POLICY "Actualizar productos (admin)"
  ON public.productos
  FOR UPDATE
  USING  (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Eliminar productos (admin)"
  ON public.productos
  FOR DELETE
  USING (auth.is_admin());


-- ============================================================
-- TABLA: orders
-- ============================================================

DROP POLICY IF EXISTS "Only authenticated users can view orders" ON public.orders;

-- INSERT público se mantiene: los clientes crean pedidos desde la web

CREATE POLICY "Solo admin puede ver pedidos"
  ON public.orders
  FOR SELECT
  USING (auth.is_admin());

-- UPDATE y DELETE de pedidos: solo admin
DROP POLICY IF EXISTS "Solo admin puede actualizar pedidos" ON public.orders;
DROP POLICY IF EXISTS "Solo admin puede eliminar pedidos"   ON public.orders;

CREATE POLICY "Solo admin puede actualizar pedidos"
  ON public.orders
  FOR UPDATE
  USING  (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Solo admin puede eliminar pedidos"
  ON public.orders
  FOR DELETE
  USING (auth.is_admin());


-- ============================================================
-- STORAGE: imagenes-productos
-- ============================================================

DROP POLICY IF EXISTS "Subir imágenes (autenticado)"      ON storage.objects;
DROP POLICY IF EXISTS "Actualizar imágenes (autenticado)" ON storage.objects;
DROP POLICY IF EXISTS "Eliminar imágenes (autenticado)"   ON storage.objects;

CREATE POLICY "Subir imágenes (admin)"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'imagenes-productos'
    AND auth.is_admin()
  );

CREATE POLICY "Actualizar imágenes (admin)"
  ON storage.objects
  FOR UPDATE
  USING  (bucket_id = 'imagenes-productos' AND auth.is_admin())
  WITH CHECK (bucket_id = 'imagenes-productos' AND auth.is_admin());

CREATE POLICY "Eliminar imágenes (admin)"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'imagenes-productos'
    AND auth.is_admin()
  );
