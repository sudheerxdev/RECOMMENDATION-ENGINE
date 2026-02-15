import { Router } from 'express';
import { listCareerPaths } from '../controllers/careerController.js';

const router = Router();

router.get('/', listCareerPaths);

export default router;
