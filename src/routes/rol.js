import { Router } from 'express';
import { verificarToken, verificarAdmin } from '../middleware/auth';

import { obtenerRol, obtenerRoles } from '../controllers/roles.controller';

const router = Router();

router.get('/', obtenerRoles);
router.get('/:id', obtenerRol);

export default router;