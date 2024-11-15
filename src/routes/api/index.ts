import { Router } from 'express';

import pageRoutes from './pages/index.js';
import userRoutes from './user.js';
import bookRoutes from './books.js';

const router = Router();

router.use('/page', pageRoutes);

router.use('/users', userRoutes);
router.use('/books', bookRoutes);

export default router;
