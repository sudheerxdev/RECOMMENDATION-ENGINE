import { Router } from 'express';
import authRoutes from './authRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import chatRoutes from './chatRoutes.js';
import careerRoutes from './careerRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is healthy'
  });
});

router.use('/auth', authRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/resume', resumeRoutes);
router.use('/chat', chatRoutes);
router.use('/careers', careerRoutes);

export default router;
