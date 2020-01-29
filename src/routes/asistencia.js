import { Router } from 'express';
const router = Router();

import { verificarToken, verificarAdmin } from '../middleware/auth';
import { registrarAsistencia, obtenerAsistencias, obtenerAsistenciaEmpleadoId, descargarReporteAsistencias, registrarAsistenciaWeb, obtenerAsistenciasPorFecha, obtenerTiempoAsistencia, sincronizarAsistencia } from '../controllers/asistencia.controller';

//router.get('/:id', verificarToken, obtenerAsistencia);
router.get('/', verificarToken, obtenerAsistencias);
router.get('/empleado/:id', obtenerAsistenciaEmpleadoId);
router.get('/report/:id', descargarReporteAsistencias);

// Obtener ultimas asistencias...
router.get('/empleado/last/:id', verificarToken, obtenerAsistenciasPorFecha);
// Obtiene el tiempo total laborado...
router.get('/time', verificarToken, obtenerTiempoAsistencia);

router.post('/', verificarToken, registrarAsistencia);
router.post('/sync', verificarToken, sincronizarAsistencia);
router.post('/web', [verificarToken, verificarAdmin], registrarAsistenciaWeb);

export default router;