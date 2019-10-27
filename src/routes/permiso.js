import { Router } from 'express';
import { verificarToken, verificarAdmin } from '../middleware/auth';

import { obtenerCatalogoPermiso } from '../controllers/permiso.controller';

const router = Router();

router.get('/', verificarToken, obtenerCatalogoPermiso);

export default router;