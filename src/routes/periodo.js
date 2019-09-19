import { Router } from 'express';

import { crearPeriodo, obtenerPeriodoPorIdCargo, modificarPeriodo, eliminarPeriodo, obtenerPeriodo } from '../controllers/periodo.controller';

const router = Router();

router.post('/', crearPeriodo);

router.get('/cargo/:id', obtenerPeriodoPorIdCargo);

router.get('/:id', obtenerPeriodo);

router.put('/:id', modificarPeriodo);

router.delete('/:id', eliminarPeriodo);


export default router;