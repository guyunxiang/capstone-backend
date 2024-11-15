import { Router } from 'express';

import homePageRoutes from './home.js';

const router = Router();

router.use('/', homePageRoutes);

export default router;
