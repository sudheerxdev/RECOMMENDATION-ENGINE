import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(2).max(3000),
  recommendationContext: z
    .array(
      z.object({
        title: z.string(),
        suitabilityScore: z.number()
      })
    )
    .max(5)
    .optional()
});
