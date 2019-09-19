import { Router } from 'express';

import { crearEmpleado, obtenerEmpleado } from '../controllers/empleado.controller';

const router = Router();

router.post('/', crearEmpleado);
router.get('/:id', obtenerEmpleado);

export default router;