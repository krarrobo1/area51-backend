import { Router } from 'express';
import { obtenerPermiso, obtenerPermisosPorEmpleadoId, crearPermiso, modificarPermiso, eliminarPermiso } from '../controllers/detallepermiso.controller';

const router = Router();
router.get('/empleado/:id', obtenerPermisosPorEmpleadoId); // TODO arreglar esto
router.get('/:id', obtenerPermiso); // se esta confundiendo con esta ruta!
router.post('/', crearPermiso);
router.put('/:id', modificarPermiso);
router.delete('/:id', eliminarPermiso);


export default router;