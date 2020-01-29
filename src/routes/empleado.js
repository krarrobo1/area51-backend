import { Router } from 'express';
import { verificarToken, verificarAdmin, verificarSuperAdmin } from '../middleware/auth';
import { crearEmpleado, obtenerEmpleado, modificarEmpleado, eliminarEmpleado, obtenerEmpleadosPorEmpresa, setPassword, forgotPassword } from '../controllers/empleado.controller';

const router = Router();

// router.post('/', [verificarToken, verificarAdmin], crearEmpleado);


router.post('/', crearEmpleado);
router.post('/password', setPassword);
router.post('/forgot', forgotPassword);
router.get('/:id', [verificarToken, verificarAdmin], obtenerEmpleado);
router.get('/empresa/:id', [verificarToken, verificarAdmin], obtenerEmpleadosPorEmpresa);
router.put('/:id', [verificarToken, verificarAdmin], modificarEmpleado);
router.delete('/:id', [verificarToken, verificarAdmin], eliminarEmpleado);

export default router;