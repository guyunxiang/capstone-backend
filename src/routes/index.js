import { Router } from 'express';

import adminRoutes from './admin/index.js';

const router = Router();

router.use('/api/admin', adminRoutes);

export default router;
