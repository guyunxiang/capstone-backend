import { Router } from 'express';

import adminRoutes from './admin/index.js';
import clientRoutes from './client/index.js';

const router = Router();

router.use('/api/admin', adminRoutes);
router.use('/api', clientRoutes);

export default router;
