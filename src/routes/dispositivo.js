import { Router } from 'express';
import { registrarDispositivo, obtenerDispositivosPorIdEmpleado, obtenerDispositivo, modificarDispositivo, eliminarDispositivo } from '../controllers/dispositivo.controller';

const router = Router();

router.get('/empleado/:id', obtenerDispositivosPorIdEmpleado)
router.post('/', registrarDispositivo);
router.get('/:id', obtenerDispositivo);
router.put('/:id', modificarDispositivo);
router.delete('/:id', eliminarDispositivo);

export default router;