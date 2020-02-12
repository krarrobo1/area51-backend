import { Router } from 'express';
import { obtenerPermiso, obtenerPermisosPorEmpleadoId, crearPermiso, modificarPermiso, eliminarPermiso, crearPermisoGeneral, obtenerPermisosPorIdEmpresa } from '../controllers/detallepermiso.controller';
import { verificarToken, verificarAdmin } from '../middleware/auth';

const router = Router();
router.get('/empleado/:id', verificarToken, obtenerPermisosPorEmpleadoId);
router.get('/:id', verificarToken, obtenerPermiso);
router.get('/empresa/:empresaid', [verificarToken, verificarAdmin], obtenerPermisosPorIdEmpresa);
router.post('/', verificarToken, crearPermiso);
router.post('/all', [verificarToken, verificarAdmin], crearPermisoGeneral);
router.put('/:id', [verificarToken, verificarAdmin], modificarPermiso);
router.delete('/:id', verificarToken, eliminarPermiso);


export default router;