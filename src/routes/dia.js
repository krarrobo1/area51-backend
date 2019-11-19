import { Router } from 'express';
import { obtenerCatalogoDias } from '../controllers/dias.controller';

const router = Router();

router.get('/', obtenerCatalogoDias);

export default router;