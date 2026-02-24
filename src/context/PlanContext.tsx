'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlanTier, PlanLimits, PLAN_LIMITS } from '@/lib/plans';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

export type BillingPeriod = 'monthly' | 'annual';

interface PlanContextValue {
  plan: PlanTier;
  limits: PlanLimits;
  setPlan: (plan: PlanTier) => void;
  billingPeriod: BillingPeriod;
  setBillingPeriod: (period: BillingPeriod) => void;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<PlanTier>('free');
  const [billingPeriod, setBillingPeriodState] = useState<BillingPeriod>('monthly');

  useEffect(() => {
    const savedPlan = storageGet<PlanTier>(STORAGE_KEYS.plan);
    if (savedPlan && savedPlan in PLAN_LIMITS) {
      setPlanState(savedPlan);
    }
    const savedBilling = storageGet<BillingPeriod>(STORAGE_KEYS.billingPeriod);
    if (savedBilling === 'monthly' || savedBilling === 'annual') {
      setBillingPeriodState(savedBilling);
    }
  }, []);

  const setPlan = (newPlan: PlanTier) => {
    setPlanState(newPlan);
    storageSet(STORAGE_KEYS.plan, newPlan);
  };

  const setBillingPeriod = (period: BillingPeriod) => {
    setBillingPeriodState(period);
    storageSet(STORAGE_KEYS.billingPeriod, period);
  };

  return (
    <PlanContext.Provider value={{ plan, limits: PLAN_LIMITS[plan], setPlan, billingPeriod, setBillingPeriod }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan must be used within a PlanProvider');
  return context;
}
