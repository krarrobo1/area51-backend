import { Router } from 'express';
import { LogIn } from '../controllers/login.controller';

const router = Router();

router.post('/', LogIn);

export default router;