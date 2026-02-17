import { Router } from 'express';
import { listOpportunities } from '../controllers/opportunityController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { opportunityQuerySchema } from '../validators/opportunityValidators.js';

const router = Router();

router.get('/', protect, validate(opportunityQuerySchema, 'query'), listOpportunities);

export default router;
