import { Router } from 'express';
import { calculateSchedule } from '../../controllers/admin/sessionsController';

const adminSchedule = Router();

// adminSchedule.post('/sessions', createSession);
adminSchedule.get('/sessions', calculateSchedule);

export default adminSchedule;