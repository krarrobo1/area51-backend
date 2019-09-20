import { Router } from 'express';
const router = Router();

import { crearAsistencia } from '../controllers/asistencia.controller';

router.get('/');
router.post('/', crearAsistencia);

export default router;