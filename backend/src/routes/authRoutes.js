import { Router } from 'express';
import { getMe, login, register, signInWithGoogle, updateMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { googleAuthSchema, loginSchema, registerSchema, updateProfileSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleAuthSchema), signInWithGoogle);
router.get('/me', protect, getMe);
router.patch('/me', protect, validate(updateProfileSchema), updateMe);

export default router;
