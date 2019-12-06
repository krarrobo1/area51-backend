import { Router } from 'express';
const router = Router();

import { verificarToken } from '../middleware/auth';
import { registrarAsistencia, obtenerAsistencia, obtenerAsistenciaEmpleadoId, descargarReporteAsistencias } from '../controllers/asistencia.controller';

//router.get('/:id', verificarToken, obtenerAsistencia);
router.get('/:id', obtenerAsistencia);
router.get('/empleado/:id', obtenerAsistenciaEmpleadoId);
router.get('/report/:id', descargarReporteAsistencias);
router.post('/', verificarToken, registrarAsistencia);

export default router;