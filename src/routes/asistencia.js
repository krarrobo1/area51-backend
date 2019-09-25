import { Router } from 'express';
const router = Router();

import { verificarToken } from '../middleware/auth';
import { crearAsistencia, obtenerAsistencia } from '../controllers/asistencia.controller';

router.get('/:id', obtenerAsistencia);
router.post('/', verificarToken, crearAsistencia);

export default router;