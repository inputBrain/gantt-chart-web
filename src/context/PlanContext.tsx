'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlanTier, PlanLimits, PLAN_LIMITS } from '@/lib/plans';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

interface PlanContextValue {
  plan: PlanTier;
  limits: PlanLimits;
  setPlan: (plan: PlanTier) => void;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<PlanTier>('free');

  useEffect(() => {
    const saved = storageGet<PlanTier>(STORAGE_KEYS.plan);
    if (saved && saved in PLAN_LIMITS) {
      setPlanState(saved);
    }
  }, []);

  const setPlan = (newPlan: PlanTier) => {
    setPlanState(newPlan);
    storageSet(STORAGE_KEYS.plan, newPlan);
  };

  return (
    <PlanContext.Provider value={{ plan, limits: PLAN_LIMITS[plan], setPlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan must be used within a PlanProvider');
  return context;
}
