import { Router } from 'express';
import { filmCreation } from './admin/film';

const router = Router();

router.use('/admin', filmCreation);

export default router;