import { Router } from 'express';
import adminFilms from './admin/film';
import adminDiscounts from './admin/discount';

const adminRouter = Router();

adminRouter.use('/admin', adminFilms);
adminRouter.use('/admin', adminDiscounts);

export default adminRouter;