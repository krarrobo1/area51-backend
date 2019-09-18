import { Router } from 'express';
import { crearEmpresa, obtenerEmpresas, obtenerEmpresa, eliminarEmpresa, actualizarEmpresa } from '../controllers/empresa.controller';

const router = Router();

// api/empresa

router.post('/', crearEmpresa);
router.get('/', obtenerEmpresas);

// api/empresa/:id

router.get('/:id', obtenerEmpresa);
router.delete('/:id', eliminarEmpresa);
router.put('/:id', actualizarEmpresa);

export default router;