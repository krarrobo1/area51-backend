import { Router } from 'express';
import { crearCargo, obtenerCargosPorEmpresaId, modificarCargo, eliminarCargo } from '../controllers/cargo.controller';


const router = Router();

// api/cargo/
router.post('/', crearCargo);
router.get('/:empresaid', obtenerCargosPorEmpresaId);
router.put('/:id', modificarCargo);
router.delete('/:id', eliminarCargo);

export default router;