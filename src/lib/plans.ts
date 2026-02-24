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

/** Numeric rank for upgrade/downgrade comparisons (higher = more powerful).
 *  Team tiers intentionally rank above solo tiers of the same tier level. */
export const PLAN_RANK: Record<PlanTier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 3,
  team: 4,
  enterprise: 5,
};

export type PlanStatus = 'current' | 'upgrade' | 'downgrade';

export function getPlanStatus(planId: string, currentPlan: PlanTier): PlanStatus {
  if (planId === currentPlan) return 'current';
  const planRank = PLAN_RANK[planId as PlanTier] ?? 0;
  return planRank > PLAN_RANK[currentPlan] ? 'upgrade' : 'downgrade';
}

/** Returns true when a value is within the limit (null = unlimited). */
export function withinLimit(current: number, max: number | null): boolean {
  return max === null || current < max;
}
