import { Router } from 'express';
import { crearEmpresa, obtenerEmpresas, obtenerEmpresa, eliminarEmpresa, actualizarEmpresa } from '../controllers/empresa.controller';
import { verificarToken, verificarSuperAdmin, verificarAdmin } from '../middleware/auth';

const router = Router();

// api/empresa

router.post('/', [verificarToken, verificarSuperAdmin], crearEmpresa);
router.get('/all', [verificarToken, verificarSuperAdmin], obtenerEmpresas);


// api/empresa/:id

router.get('/:id', [verificarToken, verificarAdmin], obtenerEmpresa);
router.delete('/:id', [verificarToken, verificarSuperAdmin], eliminarEmpresa);
router.put('/:id', [verificarToken, verificarAdmin], actualizarEmpresa);


export default router;