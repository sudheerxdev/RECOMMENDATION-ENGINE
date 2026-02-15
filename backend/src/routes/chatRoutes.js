import { Router } from 'express';
import { askAssistant } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { chatSchema } from '../validators/chatValidators.js';

const router = Router();

router.post('/ask', protect, validate(chatSchema), askAssistant);

export default router;
