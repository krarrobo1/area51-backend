import { Router } from 'express';
import { registrarDispositivo, obtenerDispositivosPorIdEmpleado, obtenerDispositivo, modificarDispositivo, eliminarDispositivo } from '../controllers/dispositivo.controller';
import { verificarToken } from '../middleware/auth';

const router = Router();

router.get('/empleado', verificarToken, obtenerDispositivosPorIdEmpleado)
router.post('/', verificarToken, registrarDispositivo);
router.get('/:id', verificarToken, obtenerDispositivo);
router.put('/:id', verificarToken, modificarDispositivo);
router.delete('/:id', verificarToken, eliminarDispositivo);

export default router;