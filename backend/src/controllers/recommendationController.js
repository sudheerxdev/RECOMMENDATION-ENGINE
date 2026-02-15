import Recommendation from '../models/Recommendation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateRecommendations } from '../services/recommendationService.js';

export const getRecommendations = asyncHandler(async (req, res) => {
  const data = await generateRecommendations({
    input: req.body,
    user: req.user
  });

  res.json({
    success: true,
    data
  });
});

export const getRecommendationHistory = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 5);
  const history = await Recommendation.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({
    success: true,
    data: history
  });
});
