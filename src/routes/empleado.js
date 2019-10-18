import { Router } from 'express';
import { verificarToken, verificarAdmin } from '../middleware/auth';
import { crearEmpleado, obtenerEmpleado, modificarEmpleado, eliminarEmpleado, obtenerEmpleadosPorEmpresa, test } from '../controllers/empleado.controller';

const router = Router();

router.post('/', [verificarToken, verificarAdmin], crearEmpleado);
router.get('/:id', verificarToken, obtenerEmpleado); // Es necesario que sea admin?
router.get('/empresa/:id', [verificarToken, verificarAdmin], obtenerEmpleadosPorEmpresa);
router.put('/:id', verificarToken, modificarEmpleado); // Es necesario que sea admin?
router.delete('/:id', [verificarToken, verificarAdmin], eliminarEmpleado);

export default router;