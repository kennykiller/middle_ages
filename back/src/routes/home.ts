import { Router } from 'express';
import { getDiscounts } from '../controllers/homeController';

const homeRouter = Router();

homeRouter.get('/discounts', getDiscounts)

export default homeRouter;