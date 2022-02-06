import { Router } from 'express';
import ticketsController from '../controllers/ticketsController.js';

const router = Router();

router.get('/api/ticket/client/:id', ticketsController.client);
router.get('/api/ticket/asesor/:id', ticketsController.asesor);

export default router;

