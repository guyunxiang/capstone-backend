import { Router } from 'express';

import userRoutes from './user.js';
import pageRoutes from './pages/index.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/page', pageRoutes);

export default router;
