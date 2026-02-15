import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { analyzeResume } from '../services/resumeService.js';
import User from '../models/User.js';
import { normalizeSkills } from '../utils/skillNormalizer.js';

export const analyzeResumeFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Resume PDF file is required');
  }

  const analysis = await analyzeResume({
    fileBuffer: req.file.buffer,
    originalName: req.file.originalname
  });

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        resumeURL: analysis.cloudinaryUrl || req.user.resumeURL || null
      },
      $addToSet: {
        skills: {
          $each: normalizeSkills(analysis.extractedSkills || [])
        }
      }
    },
    { new: true }
  );

  res.json({
    success: true,
    data: analysis
  });
});
