/// src/services/carnet.service.ts
import { createCanvas, loadImage, registerFont, Canvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import supabase from '../services/supabase'; 
// ✅ REGISTRAR FUENTE ANTON
const fontPath = path.join(__dirname, '../../storage/Fonts/Anton-Regular.ttf');
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: 'Anton' });
  console.log('✅ Fuente Anton registrada');
}

export class CarnetService {
  
  // 🔥 IMPLEMENTACIÓN de generarCarnetBuffer
  async generarCarnetBuffer(
    datosCliente: { nombre: string; apellido: string; fecha_inscripcion: Date; }, 
    mesNum: number, 
    añoNum: number
  ): Promise<Buffer> {
    console.log('⚡ [Servicio] Generando buffer para descarga rápida');
    
    // Copia el código de generarCarnetPNG pero sin guardar en disco
    const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                   'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const mesNombre = meses[mesNum - 1];
    
    // Cargar plantilla
    const plantillaPath = path.join(__dirname, '../../storage/4.png');
    if (!fs.existsSync(plantillaPath)) {
      throw new Error(`No encuentro la plantilla en: ${plantillaPath}`);
    }
    
    const plantilla = await loadImage(plantillaPath);
    const canvas = createCanvas(plantilla.width, plantilla.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(plantilla, 0, 0);
    
    // ✅ 1. NOMBRE
    ctx.font = 'bold 25px "Anton"';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    
    const nombreCompleto = `${datosCliente.nombre} ${datosCliente.apellido}`.toLowerCase();
    ctx.strokeText(nombreCompleto, 508, 285);
    ctx.fillText(nombreCompleto, 508, 285);
    
    // ✅ 2. FECHA
    ctx.font = 'bold 25px "Anton"';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    
    if (datosCliente.fecha_inscripcion) {
      const fecha = new Date(datosCliente.fecha_inscripcion);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mesFecha = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const añoFecha = fecha.getFullYear();
      
      ctx.strokeText(`${dia}-${mesFecha}-${añoFecha}`, 505, 490);
      ctx.fillText(`${dia}-${mesFecha}-${añoFecha}`, 505, 490);
    } else {
      const hoy = new Date();
      const dia = hoy.getDate().toString().padStart(2, '0');
      const mesFecha = (hoy.getMonth() + 1).toString().padStart(2, '0');
      const añoHoy = hoy.getFullYear();
      
      ctx.strokeText(`${dia}-${mesFecha}-${añoHoy}`, 500, 490);
      ctx.fillText(`${dia}-${mesFecha}-${añoHoy}`, 500, 490);
    }
    
    // ✅ 3. PAGO MENSUAL
    ctx.font = 'bold 25px "Anton"';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    
   let diaPago = '01'; // Valor por defecto
if (datosCliente.fecha_inscripcion) {
  const fechaInscripcion = new Date(datosCliente.fecha_inscripcion);
  diaPago = fechaInscripcion.getDate().toString().padStart(2, '0');
}
    ctx.strokeText(`${diaPago} de cada mes`, 505, 590);
    ctx.fillText(`${diaPago} de cada mes`, 505, 590);
    
    // ✅ 4. CHECKMARK DEL MES
    const coordenadasMeses = {
      'ENERO': { x: 82, y: 140 },
      'FEBRERO': { x: 240, y: 140 },
      'MARZO': { x: 400, y: 140 },
      'ABRIL': { x: 82, y: 270 },
      'MAYO': { x: 240, y: 270 },
      'JUNIO': { x: 400, y: 270 },
      'JULIO': { x: 82, y: 405 },
      'AGOSTO': { x: 240, y: 405 },
      'SEPTIEMBRE': { x: 400, y: 405 },
      'OCTUBRE': { x: 82, y: 540 },
      'NOVIEMBRE': { x: 240, y: 540 },
      'DICIEMBRE': { x: 400, y: 540 }
    };
    
    const coord = coordenadasMeses[mesNombre as keyof typeof coordenadasMeses];
    
    if (coord) {
      ctx.strokeStyle = 'gold';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      
      let offsetX = 0;
      let offsetY = 0;
      
      if (coord.y < 350) {
        offsetX = -28;
        offsetY = 20;
      } else if (coord.y > 450) {
        offsetX = -10;
        offsetY = -30;
      }
      
      ctx.beginPath();
      ctx.moveTo(coord.x - 23, coord.y + 55 + offsetY);
      ctx.lineTo(coord.x - 2, coord.y + 72 + offsetY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(coord.x - 2, coord.y + 72 + offsetY);
      ctx.lineTo(coord.x + 48, coord.y + 18 + offsetY);
      ctx.stroke();
    }
    
    // 🔥 DIFERENCIA CLAVE: Solo devolver buffer, NO guardar en disco
    return canvas.toBuffer('image/png');
  }
  
  // 🔥 IMPLEMENTACIÓN de generarCanvasCarnet (devuelve Canvas, no Buffer)
  async generarCanvasCarnet(
    cliente: { nombre: string; apellido: string; fecha_inscripcion: Date; }, 
    mes: number, 
    año: number
  ): Promise<Canvas> {
    console.log('🎨 [Servicio] Generando canvas para carnet');
    
    const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                   'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const mesNombre = meses[mes - 1];
    
    const plantillaPath = path.join(__dirname, '../../storage/4.png');
    if (!fs.existsSync(plantillaPath)) {
      throw new Error(`No encuentro la plantilla en: ${plantillaPath}`);
    }
    
    const plantilla = await loadImage(plantillaPath);
    const canvas = createCanvas(plantilla.width, plantilla.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(plantilla, 0, 0);
    
    // Copia el mismo código de dibujo
    ctx.font = 'bold 25px "Anton"';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    
    const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
    ctx.strokeText(nombreCompleto, 508, 285);
    ctx.fillText(nombreCompleto, 508, 285);
    
    // ... resto del código de dibujo igual que arriba ...
    
    // 🔥 DIFERENCIA: Devuelve el Canvas, no el Buffer
    return canvas;
  }
  
 async generarCarnetPNG(
  cliente: { 
    nombre: string; 
    apellido: string; 
    fecha_inscripcion?: Date;
    id?: number; // AÑADE ESTO si tienes ID de cliente
  },
  mes: number,
  año: number
): Promise<{ url: string; path: string }> {
  
  console.log('🏋️  [Servicio] Generando carnet PNG para mes:', mes, año);
  
  const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const mesNombre = meses[mes - 1];
  
  // Ruta donde está tu plantilla 4.png
  const plantillaPath = path.join(__dirname, '../../storage/4.png');
  
  if (!fs.existsSync(plantillaPath)) {
    throw new Error(`No encuentro la plantilla en: ${plantillaPath}`);
  }
  
  // Cargar plantilla
  const plantilla = await loadImage(plantillaPath);
  
  // Crear canvas del mismo tamaño
  const canvas = createCanvas(plantilla.width, plantilla.height);
  const ctx = canvas.getContext('2d');
  
  // Dibujar plantilla
  ctx.drawImage(plantilla, 0, 0);
  
  // ... [TODO TU CÓDIGO DE DIBUJO ACTUAL SE MANTIENE IGUAL] ...
  // Copia todo el código de dibujo que ya tienes (líneas 129-236)
  
  // ✅ CAMBIO CRÍTICO: En lugar de guardar en disco local, subir a Supabase
  
  // 1. Generar buffer
  const buffer = canvas.toBuffer('image/png');
  
  // 2. Generar nombre único para el archivo
  const clienteId = cliente.id || Date.now();
  const filename = `carnet-${clienteId}-${año}-${mes}-${Date.now()}.png`;
  
  // 3. Subir a Supabase Storage
  console.log('☁️  Subiendo carnet a Supabase Storage...');
  const { error: uploadError } = await supabase.storage
    .from('carnets')
    .upload(filename, buffer, {
      contentType: 'image/png',
      upsert: true // Si existe, lo reemplaza
    });
if (uploadError) {
  if (process.env.NODE_ENV === 'production') {
    // En PRODUCCIÓN (Render) sí lanza error
    throw new Error(`Error al subir carnet: ${uploadError.message}`);
  } else {
    // En DESARROLLO LOCAL solo muestra warning y continúa
    console.warn('⚠️  [DESARROLLO] Ignorando error Supabase:', uploadError.message);
    // NO lanza error, permite que continúe con guardado local
  }
}
  
  // 4. Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('carnets')
    .getPublicUrl(filename);
  
  console.log('✅ Carnet subido a:', publicUrl);
  
  // 5. (OPCIONAL) Guardar referencia en la base de datos
  if (cliente.id) {
    // Actualizar tabla pagos o clientes con la URL del carnet
    const { error: dbError } = await supabase
      .from('pagos') // o 'clientes' según tu estructura
      .update({ 
        comprobante_url: publicUrl,
        carnet_filename: filename 
      })
      .match({ 
        cliente_id: cliente.id,
        periodo_mes: mes,
        periodo_ano: año 
      });
    
    if (dbError) {
      console.warn('⚠️  No se pudo guardar referencia en DB:', dbError.message);
    }
  }
  
  // 6. Retornar la URL de Supabase (NO la ruta local)
  return {
    url: publicUrl, // URL pública de Supabase Storage
    path: filename  // Nombre del archivo en el bucket
  };
}
  /**
   * Obtener cliente desde BD (helper)
   */
  async obtenerCliente(clienteId: number, client?: any): Promise<any> {
    return null;
  }
}