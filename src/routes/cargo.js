import { Router } from 'express';
import { crearCargo, obtenerCargosPorEmpresaId, modificarCargo, eliminarCargo, obtenerCargo } from '../controllers/cargo.controller';
import { verificarToken, verificarAdmin } from '../middleware/auth';


const router = Router();

// api/cargo/
router.post('/', [verificarToken, verificarAdmin], crearCargo);
router.get('/:id', [verificarToken, verificarAdmin], obtenerCargo)
router.get('/empresa/:empresaid', [verificarToken, verificarAdmin], obtenerCargosPorEmpresaId);
router.put('/:id', [verificarToken, verificarAdmin], modificarCargo);
router.delete('/:id', [verificarToken, verificarAdmin], eliminarCargo);

export default router;