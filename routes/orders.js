import { Router } from 'express';
import ordersController from '../controllers/ordersController.js';

const router = Router();

router.post('/api/orders/save', ordersController.save);
router.post('/api/orders/change', ordersController.changestatus);
router.get('/api/orders', ordersController.get);

export default router;

