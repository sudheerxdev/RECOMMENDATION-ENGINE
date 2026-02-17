import { z } from 'zod';

export const opportunityQuerySchema = z.object({
  q: z.string().min(1).max(120).optional(),
  type: z.enum(['job', 'internship', 'all']).optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'all']).optional(),
  workMode: z.enum(['remote', 'hybrid', 'onsite', 'all']).optional(),
  roles: z.string().max(500).optional(),
  skills: z.string().max(500).optional(),
  limit: z.coerce.number().int().min(1).max(120).optional(),
  offset: z.coerce.number().int().min(0).max(5000).optional(),
  source: z.enum(['catalog', 'unstable']).optional()
});
