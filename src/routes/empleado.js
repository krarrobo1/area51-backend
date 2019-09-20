import { Router } from 'express';

import { crearEmpleado, obtenerEmpleado, modificarEmpleado, eliminarEmpleado } from '../controllers/empleado.controller';

const router = Router();

router.post('/', crearEmpleado);
router.get('/:id', obtenerEmpleado);
router.put('/:id', modificarEmpleado);
router.delete('/:id', eliminarEmpleado);

export default router;