import { Router } from 'express';
import adminFilms from './admin/film';
import adminDiscounts from './admin/discount';
import adminSchedule from './admin/schedule';

const adminRouter = Router();

adminRouter.use('/admin', adminFilms);
adminRouter.use('/admin', adminSchedule);
adminRouter.use('/admin', adminDiscounts);

export default adminRouter;