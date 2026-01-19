// controllers/carnet.controller.ts
import { Request, Response } from 'express';
import { CarnetService } from '../services/carnet.service';
import pool from '../config/database';

const carnetService = new CarnetService();

export const descargarCarnetPNG = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    
    const usuarioId = parseInt(id);
    if (isNaN(usuarioId)) return res.status(400).json({ error: 'ID inválido' });
    
    // POSTGRESQL
    const clienteQuery = await pool.query(
      'SELECT nombre, apellido, fecha_inscripcion FROM cliente WHERE usuario_id = $1',
      [usuarioId]
    );
    
    if (clienteQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const cliente = clienteQuery.rows[0];
    const hoy = new Date();
    
    // GUARDAR EN SUPABASE
    const carnetInfo = await carnetService.generarCarnetPNG(
      { 
        nombre: cliente.nombre, 
        apellido: cliente.apellido, 
        fecha_inscripcion: cliente.fecha_inscripcion || hoy,
        id: usuarioId 
      },
      hoy.getMonth() + 1,
      hoy.getFullYear()
    );
    
    if (!carnetInfo.success) {
      return res.status(500).json({ 
        error: 'Error del sistema',
        motivo: carnetInfo.error 
      });
    }
    
    const carnetBuffer = await carnetService.generarCarnetBuffer(
      { 
        nombre: cliente.nombre, 
        apellido: cliente.apellido, 
        fecha_inscripcion: cliente.fecha_inscripcion || hoy,
        id: usuarioId 
      },
      hoy.getMonth() + 1,
      hoy.getFullYear()
    );
    
    res.setHeader('Content-Type', 'image/png');
    if (carnetInfo.url) res.setHeader('X-Carnet-URL', carnetInfo.url);
    return res.send(carnetBuffer);
    
  } catch (error) {
    return res.status(500).json({ error: 'Error interno' });
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.json({ success: true, message: 'OK' });
};
