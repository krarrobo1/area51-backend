import { Router } from 'express';
import { verificarToken, verificarAdmin } from '../middleware/auth';

import { obtenerRol, obtenerRoles } from '../controllers/roles.controller';

const router = Router();

router.get('/', [verificarToken, verificarAdmin], obtenerRoles);
router.get('/:id', [verificarToken, verificarAdmin], obtenerRol);

export default router;