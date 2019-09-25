import { Router } from 'express';
import { verificarToken, verificarAdmin } from '../middleware/auth';
import { crearEmpleado, obtenerEmpleado, modificarEmpleado, eliminarEmpleado } from '../controllers/empleado.controller';

const router = Router();

router.post('/', [verificarToken, verificarAdmin], crearEmpleado);
router.get('/:id', verificarToken, obtenerEmpleado);
router.put('/:id', verificarToken, modificarEmpleado);
router.delete('/:id', [verificarToken, verificarAdmin], eliminarEmpleado);

export default router;