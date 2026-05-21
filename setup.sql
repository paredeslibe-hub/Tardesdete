-- ============================================================
-- Tardes de Té — Setup inicial de base de datos y storage
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. TABLA: productos
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.productos (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text        NOT NULL,
  precio      numeric     NOT NULL CHECK (precio >= 0),
  descripcion text,
  pilar       text        NOT NULL CHECK (pilar IN ('desayuno', 'evento')),
  categoria   text        NOT NULL,          -- 'pack', 'torta', 'saladito', etc.
  foto_url    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Índice útil para filtrar por pilar en la web
CREATE INDEX IF NOT EXISTS productos_pilar_idx ON public.productos (pilar);


-- ------------------------------------------------------------
-- 2. ROW LEVEL SECURITY — tabla productos
-- ------------------------------------------------------------

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Eliminamos las políticas si ya existen para evitar errores en re-ejecuciones
DROP POLICY IF EXISTS "Lectura pública de productos"      ON public.productos;
DROP POLICY IF EXISTS "Insertar productos (autenticado)"  ON public.productos;
DROP POLICY IF EXISTS "Actualizar productos (autenticado)" ON public.productos;
DROP POLICY IF EXISTS "Eliminar productos (autenticado)"  ON public.productos;

-- Lectura pública: cualquier visitante (anon) puede ver el catálogo
CREATE POLICY "Lectura pública de productos"
  ON public.productos
  FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden crear productos
CREATE POLICY "Insertar productos (autenticado)"
  ON public.productos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden editar productos
CREATE POLICY "Actualizar productos (autenticado)"
  ON public.productos
  FOR UPDATE
  USING  (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden eliminar productos
CREATE POLICY "Eliminar productos (autenticado)"
  ON public.productos
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- ------------------------------------------------------------
-- 3. STORAGE — bucket imagenes-productos
--
-- El SDK de Storage no expone DDL directo en SQL; los buckets
-- se crean vía la API interna de Supabase (tabla storage.buckets).
-- Este bloque es equivalente a "New bucket" en el Dashboard.
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('imagenes-productos', 'imagenes-productos', true)
ON CONFLICT (id) DO NOTHING;
-- public = true habilita URLs de acceso sin token para GET


-- ------------------------------------------------------------
-- 4. RLS — bucket imagenes-productos
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Lectura pública de imágenes"      ON storage.objects;
DROP POLICY IF EXISTS "Subir imágenes (autenticado)"     ON storage.objects;
DROP POLICY IF EXISTS "Actualizar imágenes (autenticado)" ON storage.objects;
DROP POLICY IF EXISTS "Eliminar imágenes (autenticado)"  ON storage.objects;

-- Lectura pública: cualquier usuario puede ver/descargar imágenes
CREATE POLICY "Lectura pública de imágenes"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'imagenes-productos');

-- Solo usuarios autenticados pueden subir imágenes
CREATE POLICY "Subir imágenes (autenticado)"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'imagenes-productos'
    AND auth.role() = 'authenticated'
  );

-- Solo usuarios autenticados pueden reemplazar imágenes (upsert)
CREATE POLICY "Actualizar imágenes (autenticado)"
  ON storage.objects
  FOR UPDATE
  USING  (bucket_id = 'imagenes-productos' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'imagenes-productos' AND auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden borrar imágenes
CREATE POLICY "Eliminar imágenes (autenticado)"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'imagenes-productos'
    AND auth.role() = 'authenticated'
  );
