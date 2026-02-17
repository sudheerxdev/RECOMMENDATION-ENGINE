import { asyncHandler } from '../utils/asyncHandler.js';
import { askCareerAssistant } from '../services/llmService.js';

export const askAssistant = asyncHandler(async (req, res) => {
  const { message, chatHistory = [], recommendationContext = [] } = req.body;

  const reply = await askCareerAssistant({
    message,
    chatHistory,
    userProfile: {
      skills: req.user?.skills || [],
      interests: req.user?.interests || [],
      experienceLevel: req.user?.experienceLevel || 'entry',
      preferences: req.user?.preferences || {}
    },
    recommendationContext
  });

  res.json({
    success: true,
    data: {
      reply
    }
  });
});
