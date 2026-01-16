import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Checking database configuration...');
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Present' : '❌ Missing');
console.log('🔍 NODE_ENV:', process.env.NODE_ENV || 'development');

// Usar DATABASE_URL si está disponible (para Render/Supabase)
// Si no, usar las variables individuales (para desarrollo local)
const connectionConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false  // ¡IMPORTANTE para Supabase!
      } : false
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'bd_gym',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: false
    };

const pool = new Pool(connectionConfig);

// Eventos para monitorear la conexción
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
  console.log('📊 Modo:', process.env.DATABASE_URL ? 'Supabase (URL)' : 'Local (individual vars)');
});

pool.on('error', (err: NodeJS.ErrnoException) => {
  console.error('❌ Error de conexion a BD:', err.message);
  console.error('Código error:', err.code);
});

// Exporta el pool para usarlo en todo el proyecto
export default pool;