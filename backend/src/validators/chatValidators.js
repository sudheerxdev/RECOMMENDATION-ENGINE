import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(2).max(3000),
  chatHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000)
      })
    )
    .max(12)
    .optional(),
  recommendationContext: z
    .array(
      z.object({
        title: z.string(),
        suitabilityScore: z.number(),
        skillGap: z.array(z.string()).max(10).optional(),
        recommendedSkillsToLearn: z.array(z.string()).max(10).optional()
      })
    )
    .max(5)
    .optional()
});
