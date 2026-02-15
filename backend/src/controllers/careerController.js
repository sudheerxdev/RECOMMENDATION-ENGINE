import CareerPath from '../models/CareerPath.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCareerPaths = asyncHandler(async (_req, res) => {
  const careers = await CareerPath.find({ isActive: true })
    .select('title description requiredSkills optionalSkills relatedJobRoles tags')
    .sort({ popularityScore: -1 })
    .lean();

  res.json({
    success: true,
    data: careers
  });
});
