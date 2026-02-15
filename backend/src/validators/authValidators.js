import { z } from 'zod';

const preferenceSchema = z
  .object({
    desiredWorkStyle: z.enum(['remote', 'hybrid', 'onsite', 'any']).optional(),
    targetIndustries: z.array(z.string().min(1).max(60)).max(12).optional(),
    learningPace: z.enum(['casual', 'balanced', 'intensive']).optional()
  })
  .optional();

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  skills: z.array(z.string().min(1).max(50)).max(60).optional(),
  interests: z.array(z.string().min(1).max(50)).max(40).optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior']).optional(),
  preferences: preferenceSchema
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(20)
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  resumeURL: z.string().url().nullable().optional(),
  skills: z.array(z.string().min(1).max(50)).max(60).optional(),
  interests: z.array(z.string().min(1).max(50)).max(40).optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior']).optional(),
  preferences: preferenceSchema
});
