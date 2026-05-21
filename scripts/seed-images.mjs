/**
 * seed-images.mjs
 * Sube las fotos de la carpeta /public a Supabase Storage
 * y actualiza foto_url en la tabla productos.
 *
 * Uso: node scripts/seed-images.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');

const SUPABASE_URL = 'https://xkqzcuiizpvdtqoxkczb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UA9pOc9eo_kahaDvK3O5Iw_hHHn8FFK';
const BUCKET       = 'imagenes-productos';

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Autenticación (necesaria para las políticas de escritura en Storage)
console.log('🔐 Iniciando sesión...');
const { error: authError } = await db.auth.signInWithPassword({
  email:    'libe.disenos@gmail.com',
  password: 'Acceso.2026',
});
if (authError) { console.error('Error de autenticación:', authError.message); process.exit(1); }
console.log('✓ Sesión iniciada\n');

// ── Mapa: nombre del producto → archivo local en /public
const PRODUCT_IMAGES = [
  { nombre: 'Salamix',           file: 'salamix.jpeg' },
  { nombre: 'De todito',         file: 'de-todito.jpeg' },
  { nombre: 'Willy Wonka',       file: 'willy-wonka.jpeg' },
  { nombre: 'Festejito',         file: 'festejito.jpeg' },
  { nombre: 'Planazo',           file: 'planazo.jpeg' },
  { nombre: 'Full Tardes de Té', file: 'full.jpeg' },
  { nombre: 'Pan Brioche',       file: 'saladitos.jpeg' },
  { nombre: 'Fosforitos',        file: 'fosforitos.jpeg' },
];

let ok = 0;
let fail = 0;

for (const item of PRODUCT_IMAGES) {
  const localPath   = resolve(ROOT, 'public', item.file);
  const storagePath = `productos/${item.file}`;

  // 1. Leer archivo local
  let buffer;
  try {
    buffer = readFileSync(localPath);
  } catch {
    console.error(`✗ No se encontró el archivo: public/${item.file}`);
    fail++;
    continue;
  }

  // 2. Subir a Supabase Storage (upsert para no fallar si ya existe)
  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    console.error(`✗ Error subiendo ${item.file}:`, uploadError.message);
    fail++;
    continue;
  }

  // 3. Obtener URL pública
  const { data } = db.storage.from(BUCKET).getPublicUrl(storagePath);
  const publicUrl = data.publicUrl;

  // 4. Actualizar foto_url en la tabla productos (busca por nombre)
  const { error: updateError } = await db
    .from('productos')
    .update({ foto_url: publicUrl })
    .eq('nombre', item.nombre);

  if (updateError) {
    console.error(`✗ Error actualizando "${item.nombre}":`, updateError.message);
    fail++;
    continue;
  }

  console.log(`✓ ${item.nombre.padEnd(20)} → ${publicUrl}`);
  ok++;
}

console.log(`\n${ok} productos actualizados, ${fail} errores.`);
await db.auth.signOut();
