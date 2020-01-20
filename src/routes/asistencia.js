import { Router } from 'express';
const router = Router();

import { verificarToken, verificarAdmin } from '../middleware/auth';
import { registrarAsistencia, obtenerAsistencia, obtenerAsistenciaEmpleadoId, descargarReporteAsistencias, registrarAsistenciaWeb, obtenerUltimasAsistenciasDelDia, obtenerEstadoAsistencia } from '../controllers/asistencia.controller';

//router.get('/:id', verificarToken, obtenerAsistencia);
router.get('/:id', obtenerAsistencia);
router.get('/empleado/:id', obtenerAsistenciaEmpleadoId);
router.get('/report/:id', descargarReporteAsistencias);

// Obtener ultimas asistencias...
router.get('/empleado/last/:id', obtenerUltimasAsistenciasDelDia);
// Obtiene el tiempo total laborado...
router.get('/empleado/status/:id', obtenerEstadoAsistencia);

router.post('/', verificarToken, registrarAsistencia);
router.post('/web', [verificarToken, verificarAdmin], registrarAsistenciaWeb);

export default router;