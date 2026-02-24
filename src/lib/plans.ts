export type PlanTier = 'free' | 'starter' | 'pro' | 'business' | 'team' | 'enterprise';

export interface PlanLimits {
  maxProjects: number | null;       // null = unlimited
  maxTasksPerProject: number | null;
  maxSubtasksPerTask: number | null;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free:       { maxProjects: 1,    maxTasksPerProject: 14,   maxSubtasksPerTask: 5    },
  starter:    { maxProjects: 3,    maxTasksPerProject: 30,   maxSubtasksPerTask: 15   },
  pro:        { maxProjects: null, maxTasksPerProject: null, maxSubtasksPerTask: null },
  business:   { maxProjects: null, maxTasksPerProject: null, maxSubtasksPerTask: null },
  team:       { maxProjects: null, maxTasksPerProject: null, maxSubtasksPerTask: null },
  enterprise: { maxProjects: null, maxTasksPerProject: null, maxSubtasksPerTask: null },
};

export const PLAN_NAMES: Record<PlanTier, string> = {
  free: 'Free', starter: 'Starter', pro: 'Pro',
  business: 'Business', team: 'Team', enterprise: 'Enterprise',
};

export const ALL_PLAN_TIERS: PlanTier[] = ['free', 'starter', 'pro', 'business', 'team', 'enterprise'];

/** Returns true when a value is within the limit (null = unlimited). */
export function withinLimit(current: number, max: number | null): boolean {
  return max === null || current < max;
}
