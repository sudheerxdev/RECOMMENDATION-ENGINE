import { z } from 'zod';

export const recommendationRequestSchema = z.object({
  skills: z.array(z.string().min(1).max(60)).max(80).default([]),
  resumeText: z.string().max(100000).optional(),
  interests: z.array(z.string().min(1).max(60)).max(50).default([]),
  experienceLevel: z.enum(['entry', 'mid', 'senior']).default('entry'),
  preferences: z
    .object({
      desiredWorkStyle: z.enum(['remote', 'hybrid', 'onsite', 'any']).optional(),
      targetIndustries: z.array(z.string().min(1).max(60)).max(12).optional(),
      learningPace: z.enum(['casual', 'balanced', 'intensive']).optional(),
      weeklyHours: z.coerce.number().int().min(1).max(80).optional()
    })
    .optional(),
  topK: z.coerce.number().int().min(1).max(10).default(5)
});

export const recommendationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(5)
});
