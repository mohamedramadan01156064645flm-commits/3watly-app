import { z } from 'zod';
import { ALLOWED_NAV_PATHS } from './navigation';

export const CopilotRequestSchema = z.object({
  message: z.string().optional().default(''),
  text: z.string().optional(),
  attachment: z.string().optional(),
  userId: z.string().optional(),
  user: z
    .object({
      id: z.union([z.string(), z.number()]).optional(),
      email: z.string().optional(),
      fullName: z.string().optional(),
      name: z.string().optional(),
      targetRole: z.string().optional(),
    })
    .optional(),
  activeCv: z.any().optional(),
  recentMessages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().optional(),
        text: z.string().optional(),
      })
    )
    .optional(),
  currentPage: z.string().optional(),
});

export type CopilotRequest = z.infer<typeof CopilotRequestSchema>;

export const CopilotNavigationItemSchema = z.object({
  path: z.enum(ALLOWED_NAV_PATHS),
  label: z.string().min(1).max(80),
  priority: z.enum(['primary', 'secondary']).default('primary'),
});

export type CopilotNavigationItem = z.infer<typeof CopilotNavigationItemSchema>;

export const CopilotResponseSchema = z.object({
  message: z.string().min(1),
  navigation: z.array(CopilotNavigationItemSchema).max(2).optional().default([]),
  followUps: z.array(z.string().min(1).max(120)).max(3).optional().default([]),
  metadata: z
    .object({
      confidence: z.enum(['high', 'medium', 'low']).default('high'),
      usedMarketData: z.boolean().default(false),
      usedUserProfile: z.boolean().default(false),
      targetRole: z.string().optional(),
    })
    .optional(),
});

export type CopilotResponse = z.infer<typeof CopilotResponseSchema>;
