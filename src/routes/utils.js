import { Router } from 'express';
import { getServerDate } from '../controllers/utils.controller';

const router = new Router();

router.get('/date', getServerDate);

export default router;