import { Router } from 'express';
import { getRecommendationHistory, getRecommendations } from '../controllers/recommendationController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  recommendationQuerySchema,
  recommendationRequestSchema
} from '../validators/recommendationValidators.js';

const router = Router();

router.post('/', protect, validate(recommendationRequestSchema), getRecommendations);
router.get('/history', protect, validate(recommendationQuerySchema, 'query'), getRecommendationHistory);

export default router;
