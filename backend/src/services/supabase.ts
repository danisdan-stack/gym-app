// backend/config/supabase.ts - VERSIÓN CORREGIDA
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Validación segura sin non-null assertion
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ ERROR: Variables de Supabase no encontradas en .env');
  console.error('Asegúrate de tener:');
  console.error('SUPABASE_URL=https://tu-proyecto.supabase.co');
  console.error('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUz...');
  throw new Error('Configuración de Supabase incompleta');
}

// Crear cliente - TypeScript sabe que no son null por la validación
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false }
});

// Exportar
export default supabase;