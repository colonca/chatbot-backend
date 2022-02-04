import { Router } from 'express';
import authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/authJWT.js';

const router = Router();

router.post('/api/auth/login', authController.login);
router.post('/api/auth/user', verifyToken, authController.whoami);

export default router;



