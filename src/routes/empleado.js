import { Router } from 'express';
import { verificarToken, verificarAdmin } from '../middleware/auth';
import { crearEmpleado, obtenerEmpleado, modificarEmpleado, eliminarEmpleado, obtenerEmpleadosPorEmpresa, setPassword } from '../controllers/empleado.controller';

const router = Router();

router.post('/', [verificarToken, verificarAdmin], crearEmpleado);

router.post('/set', setPassword);

router.post('/forgot', setPassword);

router.get('/:id', verificarToken, obtenerEmpleado); // Es necesario que sea admin?

router.get('/empresa/:id', [verificarToken, verificarAdmin], obtenerEmpleadosPorEmpresa);

router.put('/:id', verificarToken, modificarEmpleado); // Es necesario que sea admin?

router.delete('/:id', [verificarToken, verificarAdmin], eliminarEmpleado);

export default router;