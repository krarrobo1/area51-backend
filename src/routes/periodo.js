import { Router } from 'express';
import { verificarToken, verificarAdmin } from '../middleware/auth';

import { crearPeriodo, obtenerPeriodoPorIdCargo, modificarPeriodo, eliminarPeriodo, obtenerPeriodo } from '../controllers/periodo.controller';

const router = Router();

router.post('/', [verificarToken, verificarAdmin], crearPeriodo);

router.get('/cargo/:id', verificarToken, obtenerPeriodoPorIdCargo);

router.get('/:id', [verificarToken, verificarAdmin], obtenerPeriodo);

router.put('/:id', [verificarToken, verificarAdmin], modificarPeriodo);

router.delete('/:id', [verificarToken, verificarAdmin], eliminarPeriodo);


export default router;