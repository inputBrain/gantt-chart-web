'use client';

import { useState, useEffect } from 'react';

// ─── Icons ────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

// ─── Plan data ────────────────────────────────────────────────

type PlanColor = 'neutral' | 'success' | 'accent' | 'purple';
type Currency = 'usd' | 'uah';

type Plan = {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  uahPrice: number;
  uahYearlyPrice: number;
  priceLabel: string | null;
  popular: boolean;
  color: PlanColor;
  inherits: string | null;
  features: string[];
  cta: string;
};

const PLANS_SOLO: Plan[] = [
  {
    id: 'free', name: 'Free', price: 0, yearlyPrice: 0, uahPrice: 0, uahYearlyPrice: 0, priceLabel: null,
    popular: false, color: 'neutral', inherits: null,
    features: [
      '1 Editor · Unlimited Viewers',
      'Up to 14 tasks per project',
      'Up to 5 subtasks per task',
      'Basic Gantt chart',
      'No time restriction',
    ],
    cta: 'Get Started',
  },
  {
    id: 'starter', name: 'Starter', price: 12, yearlyPrice: 9.6, uahPrice: 1000, uahYearlyPrice: 800, priceLabel: null,
    popular: false, color: 'success', inherits: null,
    features: [
      '1 Editor · Unlimited Viewers',
      'Unlimited tasks & subtasks',
      'Unlimited projects',
      'Full Gantt chart',
      'PDF export',
      'No time restriction',
    ],
    cta: 'Get Started',
  },
  {
    id: 'pro', name: 'Pro', price: 25, yearlyPrice: 20, uahPrice: 2100, uahYearlyPrice: 1680, priceLabel: null,
    popular: true, color: 'accent', inherits: 'Starter',
    features: [
      'Task dependencies & critical path',
      'PDF & Excel export',
      'Custom themes',
      'Calendar & timeline view',
      '14-day money-back guarantee',
    ],
    cta: 'Get Started',
  },
  {
    id: 'business', name: 'Business', price: 45, yearlyPrice: 36, uahPrice: 3800, uahYearlyPrice: 3040, priceLabel: null,
    popular: false, color: 'purple', inherits: 'Pro',
    features: [
      'Advanced analytics & reports',
      'White-label branding',
      'Audit log & history',
      'Priority feature roadmap',
    ],
    cta: 'Contact Sales',
  },
];

const PLANS_TEAM: Plan[] = [
  {
    id: 'free', name: 'Free', price: 0, yearlyPrice: 0, uahPrice: 0, uahYearlyPrice: 0, priceLabel: null,
    popular: false, color: 'neutral', inherits: null,
    features: [
      '1 Editor · Unlimited Viewers',
      'Up to 14 tasks per project',
      'Up to 5 subtasks per task',
      'Basic Gantt chart',
      'No time restriction',
    ],
    cta: 'Get Started',
  },
  {
    id: 'starter', name: 'Starter', price: 12, yearlyPrice: 9.6, uahPrice: 1000, uahYearlyPrice: 800, priceLabel: 'per editor / month',
    popular: false, color: 'success', inherits: null,
    features: [
      'Up to 3 Editors · Unlimited Viewers',
      'Unlimited tasks & subtasks',
      'Unlimited projects',
      'Full Gantt chart',
      'Shared workspace',
      'PDF export',
    ],
    cta: 'Get Started',
  },
  {
    id: 'team', name: 'Team', price: 50, yearlyPrice: 40, uahPrice: 4200, uahYearlyPrice: 3360, priceLabel: 'per editor / month',
    popular: true, color: 'accent', inherits: 'Starter',
    features: [
      'Up to 10 Editors',
      'Role-based permissions',
      'Task dependencies',
      'PDF & Excel export',
      'Custom themes',
      '14-day money-back guarantee',
    ],
    cta: 'Get Started',
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 100, yearlyPrice: 80, uahPrice: 8400, uahYearlyPrice: 6720, priceLabel: 'per editor / month',
    popular: false, color: 'purple', inherits: 'Team',
    features: [
      'Unlimited Editors',
      'SSO / SAML login',
      'White-label branding',
      'Advanced analytics & reports',
      'Audit log & history',
      'Priority feature roadmap',
    ],
    cta: 'Contact Sales',
  },
];

// ─── Color map ────────────────────────────────────────────────

const COLOR_MAP: Record<PlanColor, {
  cardClass: string;
  priceClass: string;
  checkBgClass: string;
  checkIconClass: string;
  btnClass: string;
}> = {
  neutral: {
    cardClass: 'border border-border-primary hover:border-border-secondary hover:shadow-lg',
    priceClass: '',
    checkBgClass: 'bg-bg-tertiary',
    checkIconClass: 'text-text-tertiary',
    btnClass: 'border border-border-secondary text-text-primary hover:bg-bg-hover',
  },
  success: {
    cardClass: 'border border-border-primary hover:border-success hover:shadow-xl hover:shadow-success/10',
    priceClass: 'group-hover:text-success',
    checkBgClass: 'bg-bg-tertiary group-hover:bg-success-light',
    checkIconClass: 'text-text-tertiary group-hover:text-success',
    btnClass: 'border border-border-secondary text-text-primary hover:bg-bg-hover group-hover:border-success group-hover:text-success',
  },
  accent: {
    cardClass: 'border-2 border-accent shadow-lg shadow-accent/10 hover:shadow-xl hover:shadow-accent/20',
    priceClass: 'text-accent',
    checkBgClass: 'bg-accent-light',
    checkIconClass: 'text-accent',
    btnClass: 'bg-accent text-accent-text hover:bg-accent-hover',
  },
  purple: {
    cardClass: 'border border-border-primary hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10',
    priceClass: 'group-hover:text-purple-500',
    checkBgClass: 'bg-bg-tertiary group-hover:bg-purple-100',
    checkIconClass: 'text-text-tertiary group-hover:text-purple-500',
    btnClass: 'border border-purple-500 text-purple-600 hover:bg-purple-50',
  },
};

// ─── Plan card ────────────────────────────────────────────────

function PlanCard({ plan, annual, currency }: { plan: Plan; annual: boolean; currency: Currency }) {
  const c = COLOR_MAP[plan.color];
  const isAccent = plan.color === 'accent';
  const isUah = currency === 'uah';

  const rawMonthly = isUah ? plan.uahPrice : plan.price;
  const rawYearly  = isUah ? plan.uahYearlyPrice : plan.yearlyPrice;
  const displayPrice = annual ? Math.round(rawYearly * 12) : rawMonthly;
  const symbol = isUah ? '₴' : '$';
  const priceUnit = annual ? '/year + tax' : '/month + tax';

  return (
    <div className={`group relative rounded-2xl bg-bg-primary p-8 transition-all ${c.cardClass}`}>
      {isAccent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          MOST POPULAR
        </div>
      )}

      {/* Name */}
      <div className="flex items-center gap-1.5">
        <h3 className="text-base font-bold text-text-primary">{plan.name}</h3>
        {plan.color === 'purple' && <CrownIcon className="h-4 w-4 text-purple-500" />}
      </div>

      {/* Price */}
      <div className="mt-3">
        {rawMonthly === 0 ? (
          <span className="text-4xl font-bold text-text-primary">Free</span>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold transition-colors ${isAccent ? c.priceClass : `text-text-primary ${c.priceClass}`}`}>
                {symbol}{displayPrice}
              </span>
              <span className="text-text-tertiary text-sm">{priceUnit}</span>
            </div>
            {plan.priceLabel && (
              <p className="text-xs text-text-tertiary mt-0.5">{plan.priceLabel}</p>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <button className={`mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${c.btnClass}`}>
        {plan.cta}
      </button>

      {/* Features */}
      <div className="mt-5">
        {plan.inherits && (
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Everything in {plan.inherits}, plus:
          </p>
        )}
        <ul className="space-y-2.5">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <div className={`h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${c.checkBgClass}`}>
                <CheckIcon className={`h-3 w-3 transition-colors ${c.checkIconClass}`} />
              </div>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function PricingPage() {
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [annual, setAnnual] = useState(false);
  const [currency, setCurrency] = useState<Currency>('usd');
  const plans = mode === 'solo' ? PLANS_SOLO : PLANS_TEAM;

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then((data: { country_code?: string }) => {
        if (data.country_code === 'UA') setCurrency('uah');
      })
      .catch(() => {});
  }, []);

  const pill = (active: boolean) =>
    `px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-accent text-accent-text shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="relative text-center mb-10 py-14 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.15] via-accent/[0.05] to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.09] to-transparent pointer-events-none" />

          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 relative">Pricing</p>
          <h1 className="text-4xl font-bold text-text-primary relative">Simple, transparent pricing</h1>
          <p className="text-text-secondary mt-4 text-base max-w-md mx-auto relative">
            Start free. No credit card required. Upgrade when you&apos;re ready.
          </p>
          <p className="text-text-tertiary mt-2 text-sm relative">
            Licenses can be used in{' '}
            <span className="font-medium text-text-secondary">Microsoft Teams</span>,{' '}
            <span className="font-medium text-text-secondary">Excel</span> and{' '}
            <span className="font-medium text-text-secondary">PowerPoint</span>.
          </p>
          <div className="flex items-center justify-center gap-6 mt-5 relative">
            {['No credit card', 'Cancel anytime', 'Free plan forever'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-text-tertiary">
                <svg className="h-4 w-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-10">
          <div className="inline-flex rounded-2xl bg-bg-tertiary p-1.5 gap-1">
            <button onClick={() => setMode('solo')} className={pill(mode === 'solo')}>Solo</button>
            <button onClick={() => setMode('team')} className={pill(mode === 'team')}>Team</button>
          </div>
          <div className="inline-flex rounded-2xl bg-bg-tertiary p-1.5 gap-1">
            <button onClick={() => setAnnual(false)} className={pill(!annual)}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={pill(annual)}>
              Annual{' '}
              {annual
                ? <span className="text-xs font-bold">−20%</span>
                : <span className="text-success text-xs font-bold">−20%</span>}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-8">
          {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan} annual={annual} currency={currency} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-text-tertiary mt-8">
          {currency === 'uah'
            ? 'Всі ціни у гривнях (₴). Ціни можуть відрізнятися залежно від регіону.'
            : 'All prices in USD. Tax may apply depending on your location.'}
          <br />
          Annual plans are billed once per year. You can cancel at any time.
        </p>

      </div>
    </div>
  );
}
