import { Router } from 'express';
import multer from 'multer';
import { analyzeResumeFile } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new ApiError(400, 'Only PDF files are supported'));
      return;
    }
    cb(null, true);
  }
});

router.post('/analyze', protect, upload.single('resume'), analyzeResumeFile);

export default router;
