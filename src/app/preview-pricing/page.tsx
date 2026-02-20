'use client';

import { useState } from 'react';
import Link from 'next/link';

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

function Toggle({ annual, setAnnual }: { annual: boolean; setAnnual: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <span className={`text-sm font-medium ${!annual ? 'text-text-primary' : 'text-text-tertiary'}`}>Monthly</span>
      <button
        onClick={() => setAnnual(!annual)}
        className={`relative w-11 h-6 rounded-full transition-colors ${annual ? 'bg-accent' : 'bg-border-secondary'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${annual ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
      <span className={`text-sm font-medium ${annual ? 'text-text-primary' : 'text-text-tertiary'}`}>
        Annual <span className="text-success text-xs font-bold">−20%</span>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ПЛАНИ
// ─────────────────────────────────────────────────────────────

// Варіант 1 — оригінал (не чіпати)
const PLANS_V1 = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    priceLabel: null as string | null,
    description: '1 editor · unlimited viewers',
    popular: false,
    color: 'neutral' as const,
    features: [
      '1 Editor',
      'Unlimited Viewers',
      '5 tasks per project',
      '1 subtask per task',
      'Basic Gantt view',
      'Community support',
    ],
    cta: 'Start Free',
  },
  {
    id: 'solo',
    name: 'Solo',
    price: 12,
    yearlyPrice: 10,
    priceLabel: null as string | null,
    description: '1 editor · unlimited viewers',
    popular: false,
    color: 'success' as const,
    features: [
      '1 Editor',
      'Unlimited Viewers',
      '14 tasks per project',
      '5 subtasks per task',
      'Full Gantt chart',
      'Email support',
      'PDF export',
    ],
    cta: 'Get Started',
  },
  {
    id: 'team',
    name: 'Team',
    price: 50,
    yearlyPrice: 40,
    priceLabel: 'per editor / month',
    description: 'Multiple editors & viewers',
    popular: true,
    color: 'accent' as const,
    features: [
      'Up to 10 Editors',
      'Unlimited Viewers',
      'Unlimited tasks',
      'Unlimited subtasks',
      'Advanced Gantt chart',
      'Priority support',
      'PDF / Excel export',
      'Task dependencies',
      'Custom themes',
    ],
    cta: 'Get Started',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 100,
    yearlyPrice: 80,
    priceLabel: 'per editor / month',
    description: 'For large organizations',
    popular: false,
    color: 'purple' as const,
    features: [
      'Unlimited Editors',
      'Unlimited Viewers',
      'Unlimited tasks & subtasks',
      'API access',
      'White-label branding',
      'SSO / SAML',
      'Dedicated support manager',
      'SLA guarantee',
      'Custom integrations',
      'Priority feature roadmap',
    ],
    cta: 'Contact Sales',
  },
];

// Варіант 2 — Solo path
const PLANS_V2_SOLO = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    priceLabel: null as string | null,
    popular: false,
    color: 'neutral' as const,
    inherits: null as string | null,
    features: [
      '1 Editor',
      'Unlimited Viewers',
      '5 tasks per project',
      '1 subtask per task',
      'Basic Gantt view',
      'Community support',
    ],
    cta: 'Get Started',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 12,
    yearlyPrice: 10,
    priceLabel: null as string | null,
    popular: false,
    color: 'success' as const,
    inherits: null as string | null,
    features: [
      '1 Editor',
      'Unlimited Viewers',
      '14 tasks per project',
      '5 subtasks per task',
      'Full Gantt chart',
      'Email support',
      'PDF export',
    ],
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 25,
    yearlyPrice: 20,
    priceLabel: null as string | null,
    popular: true,
    color: 'accent' as const,
    inherits: 'Starter' as string | null,
    features: [
      'Unlimited tasks & subtasks',
      'Advanced Gantt chart',
      'Priority support',
      'PDF / Excel export',
      'Task dependencies',
      'Custom themes',
    ],
    cta: 'Get Started',
  },
  {
    id: 'business',
    name: 'Business',
    price: 45,
    yearlyPrice: 36,
    priceLabel: null as string | null,
    popular: false,
    color: 'purple' as const,
    inherits: 'Pro' as string | null,
    features: [
      'API access',
      'Advanced analytics',
      'White-label branding',
      'Zapier / Slack sync',
      'Audit logs',
      'Priority feature roadmap',
    ],
    cta: 'Contact Sales',
  },
];

// Варіант 2 — Team path
const PLANS_V2_TEAM = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    priceLabel: null as string | null,
    popular: false,
    color: 'neutral' as const,
    inherits: null as string | null,
    features: [
      '1 Editor',
      'Unlimited Viewers',
      '5 tasks per project',
      '1 subtask per task',
      'Basic Gantt view',
      'Community support',
    ],
    cta: 'Get Started',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 12,
    yearlyPrice: 10,
    priceLabel: 'per editor / month',
    popular: false,
    color: 'success' as const,
    inherits: null as string | null,
    features: [
      'Up to 3 Editors',
      'Unlimited Viewers',
      '14 tasks per project',
      '5 subtasks per task',
      'Full Gantt chart',
      'Email support',
      'PDF export',
    ],
    cta: 'Get Started',
  },
  {
    id: 'team',
    name: 'Team',
    price: 50,
    yearlyPrice: 40,
    priceLabel: 'per editor / month',
    popular: true,
    color: 'accent' as const,
    inherits: 'Starter' as string | null,
    features: [
      'Up to 10 Editors',
      'Unlimited tasks & subtasks',
      'Advanced Gantt chart',
      'Priority support',
      'PDF / Excel export',
      'Task dependencies',
      'Custom themes',
    ],
    cta: 'Get Started',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 100,
    yearlyPrice: 80,
    priceLabel: 'per editor / month',
    popular: false,
    color: 'purple' as const,
    inherits: 'Team' as string | null,
    features: [
      'Unlimited Editors',
      'API access',
      'White-label branding',
      'SSO / SAML',
      'Dedicated support manager',
      'SLA guarantee',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
  },
];

type PlanColor = 'neutral' | 'success' | 'accent' | 'purple';

type AnyPlan = {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  priceLabel: string | null;
  popular: boolean;
  color: PlanColor;
  features: string[];
  cta: string;
  inherits?: string | null;
};

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

// ─────────────────────────────────────────────────────────────
// V3 — ПЛАНИ (best practices 2026)
// ─────────────────────────────────────────────────────────────

interface PlanV3 {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  priceLabel: string | null;
  popular: boolean;
  color: PlanColor;
  inherits: string | null;   // "Everything in X, plus:"
  features: string[];
  cta: string;
  ctaTrust: string | null;   // під кнопкою: "No credit card required" тощо
}

const PLANS_V3_SOLO: PlanV3[] = [
  {
    id: 'free', name: 'Free', price: 0, yearlyPrice: 0, priceLabel: null,
    popular: false, color: 'neutral', inherits: null,
    features: ['1 Editor', 'Unlimited Viewers', '5 tasks per project', '1 subtask per task', 'Basic Gantt view', 'Community support'],
    cta: 'Start for free', ctaTrust: 'No credit card required',
  },
  {
    id: 'starter', name: 'Starter', price: 12, yearlyPrice: 10, priceLabel: null,
    popular: false, color: 'success', inherits: null,
    features: ['1 Editor', 'Unlimited Viewers', '14 tasks per project', '5 subtasks per task', 'Full Gantt chart', 'Email support', 'PDF export'],
    cta: 'Start free trial', ctaTrust: 'No credit card required',
  },
  {
    id: 'pro', name: 'Pro', price: 25, yearlyPrice: 20, priceLabel: null,
    popular: true, color: 'accent', inherits: 'Starter',
    features: ['Unlimited tasks & subtasks', 'Advanced Gantt chart', 'Priority support', 'PDF / Excel export', 'Task dependencies', 'Custom themes'],
    cta: 'Start free trial', ctaTrust: '14-day free trial included',
  },
  {
    id: 'business', name: 'Business', price: 45, yearlyPrice: 36, priceLabel: null,
    popular: false, color: 'purple', inherits: 'Pro',
    features: ['API access', 'Advanced analytics', 'White-label branding', 'Zapier / Slack sync', 'Audit logs', 'Priority feature roadmap'],
    cta: 'Start free trial', ctaTrust: 'No credit card required',
  },
];

const PLANS_V3_TEAM: PlanV3[] = [
  {
    id: 'free', name: 'Free', price: 0, yearlyPrice: 0, priceLabel: null,
    popular: false, color: 'neutral', inherits: null,
    features: ['1 Editor', 'Unlimited Viewers', '5 tasks per project', '1 subtask per task', 'Basic Gantt view', 'Community support'],
    cta: 'Start for free', ctaTrust: 'No credit card required',
  },
  {
    id: 'starter', name: 'Starter', price: 12, yearlyPrice: 10, priceLabel: 'per editor / month',
    popular: false, color: 'success', inherits: null,
    features: ['Up to 3 Editors', 'Unlimited Viewers', '14 tasks per project', '5 subtasks per task', 'Full Gantt chart', 'Email support', 'PDF export'],
    cta: 'Start free trial', ctaTrust: 'No credit card required',
  },
  {
    id: 'team', name: 'Team', price: 50, yearlyPrice: 40, priceLabel: 'per editor / month',
    popular: true, color: 'accent', inherits: 'Starter',
    features: ['Up to 10 Editors', 'Unlimited tasks & subtasks', 'Advanced Gantt chart', 'Priority support', 'PDF / Excel export', 'Task dependencies', 'Custom themes'],
    cta: 'Start free trial', ctaTrust: '14-day free trial included',
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 100, yearlyPrice: 80, priceLabel: 'per editor / month',
    popular: false, color: 'purple', inherits: 'Team',
    features: ['Unlimited Editors', 'API access', 'White-label branding', 'SSO / SAML', 'Dedicated support manager', 'SLA guarantee', 'Custom integrations'],
    cta: 'Book a demo', ctaTrust: 'We respond within 1 business day',
  },
];

// ─────────────────────────────────────────────────────────────
// V3 — ДОПОМІЖНІ КОМПОНЕНТИ
// ─────────────────────────────────────────────────────────────

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function SocialProofBar() {
  const logos = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Dunder'];
  return (
    <div className="text-center mb-10">
      <p className="text-xs text-text-tertiary uppercase tracking-widest mb-4">Trusted by teams worldwide</p>
      <div className="flex items-center justify-center gap-4 flex-wrap mb-5">
        {logos.map(name => (
          <div key={name} className="px-4 py-2 rounded-lg bg-bg-tertiary text-xs font-semibold text-text-tertiary">
            {name}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => <StarIcon key={i} className="h-4 w-4 text-warning" />)}
        </div>
        <span className="text-sm font-semibold text-text-primary">4.8</span>
        <span className="text-sm text-text-tertiary">/ 5 · 320+ reviews on G2</span>
      </div>
    </div>
  );
}

function TrustBar() {
  const items = [
    '✓  No credit card required',
    '✓  Cancel anytime',
    '✓  14-day money-back guarantee',
    '🔒  SOC 2 compliant',
    '🇪🇺  GDPR ready',
  ];
  return (
    <div className="flex items-center justify-center gap-6 flex-wrap mt-8 pt-6 border-t border-border-primary">
      {items.map(item => (
        <span key={item} className="text-xs text-text-tertiary">{item}</span>
      ))}
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'We cut project planning time in half. The Gantt view is exactly what our team needed.',
      name: 'Sarah M.', role: 'Project Lead', company: 'Acme Corp',
    },
    {
      quote: "Finally a tool that doesn't require a PhD to set up. Our team was running in 20 minutes.",
      name: 'Alex K.', role: 'CEO', company: 'Globex',
    },
    {
      quote: 'Task dependencies alone saved us from countless deadline conflicts. Worth every penny.',
      name: 'Maria T.', role: 'Operations Manager', company: 'Initech',
    },
  ];
  return (
    <div className="mt-14">
      <h3 className="text-center text-lg font-semibold text-text-primary mb-6">Loved by teams of all sizes</h3>
      <div className="grid grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-bg-secondary rounded-2xl p-6 border border-border-primary">
            <div className="flex gap-0.5 mb-4">
              {[1,2,3,4,5].map(j => <StarIcon key={j} className="h-4 w-4 text-warning" />)}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-5">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-bg-tertiary flex items-center justify-center text-sm font-bold text-text-tertiary">
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                <p className="text-xs text-text-tertiary">{t.role} · {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. Cancel from your account settings at any time — no forms, no calls. Your access continues until the end of the billing period.',
    },
    {
      q: 'What happens when my trial ends?',
      a: 'Your account automatically switches to the Free plan. No charge, no surprises. You keep all your data.',
    },
    {
      q: "What's the difference between an Editor and a Viewer?",
      a: 'Editors can create and modify projects, tasks, and subtasks. Viewers can see everything in real time — for free, with no seat limit.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'Yes — 14-day money-back guarantee, no questions asked. Just email us and we\'ll process the refund within 2 business days.',
    },
    {
      q: 'Is there a discount for startups or nonprofits?',
      a: 'Yes. We offer 50% off for early-stage startups and registered nonprofits. Contact us with your details and we\'ll set it up within 24 hours.',
    },
  ];
  return (
    <div className="mt-14 max-w-2xl mx-auto">
      <h3 className="text-center text-lg font-semibold text-text-primary mb-6">Frequently asked questions</h3>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-border-primary overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-hover transition-colors"
            >
              <span className="text-sm font-medium text-text-primary">{faq.q}</span>
              <span className={`text-text-tertiary transition-transform duration-200 text-lg leading-none ${open === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanCardV3({ plan, annual }: { plan: PlanV3; annual: boolean }) {
  const c = COLOR_MAP[plan.color];
  const isAccent = plan.color === 'accent';

  return (
    // Не-popular картки зміщені вниз → popular виглядає піднятою
    <div className={plan.popular ? '' : 'pt-5'}>
      <div className={`group relative rounded-2xl bg-bg-primary p-5 transition-all ${c.cardClass} ${plan.popular ? 'pb-8' : ''}`}>
        {isAccent && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full">
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
          {plan.price === 0 ? (
            <span className="text-4xl font-bold text-text-primary">Free</span>
          ) : annual ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-text-tertiary line-through">${plan.price * 12}/yr</span>
                <span className="text-xs font-bold text-success bg-success-light px-2 py-0.5 rounded-full">
                  2 months free
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-success">${plan.yearlyPrice * 12}</span>
                <span className="text-text-tertiary text-sm">/year</span>
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">
                ≈ ${plan.yearlyPrice}/mo{plan.priceLabel ? ' per editor' : ''}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold transition-colors ${isAccent ? c.priceClass : `text-text-primary ${c.priceClass}`}`}>
                  ${plan.price}
                </span>
                <span className="text-text-tertiary text-sm">/month</span>
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
        {plan.ctaTrust && (
          <p className="text-xs text-text-tertiary text-center mt-2">{plan.ctaTrust}</p>
        )}

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
    </div>
  );
}

function PricingV3() {
  const [annual, setAnnual] = useState(true); // annual за замовчуванням (+19% adoption)
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const plans = mode === 'solo' ? PLANS_V3_SOLO : PLANS_V3_TEAM;

  return (
    <div className="py-8">
      <SocialProofBar />

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary">Simple pricing that scales with you</h2>
        <p className="text-text-tertiary mt-2">Start free. No credit card. Upgrade when you&apos;re ready.</p>
      </div>

      {/* Controls: Solo/Team + Annual/Monthly */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <SoloTeamSwitch value={mode} onChange={setMode} />
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${!annual ? 'text-text-primary' : 'text-text-tertiary'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full transition-colors ${annual ? 'bg-accent' : 'bg-border-secondary'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${annual ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-text-primary' : 'text-text-tertiary'}`}>
            Annual{' '}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${annual ? 'text-success bg-success-light' : 'text-text-tertiary'}`}>
              2 months free
            </span>
          </span>
        </div>
      </div>

      {/* Cards — popular виглядає піднятою */}
      <div className="grid grid-cols-4 gap-5 items-start">
        {plans.map(plan => (
          <PlanCardV3 key={plan.id} plan={plan} annual={annual} />
        ))}
      </div>

      <TrustBar />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// КАРТКА
// ─────────────────────────────────────────────────────────────

function PlanCard({ plan, annual }: { plan: AnyPlan; annual: boolean }) {
  const c = COLOR_MAP[plan.color];
  const isAccent = plan.color === 'accent';
  const displayPrice = annual ? plan.yearlyPrice : plan.price;

  return (
    <div className={`group relative rounded-2xl bg-bg-primary p-5 transition-all ${c.cardClass}`}>
      {isAccent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full">
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
        {plan.price === 0 ? (
          <span className="text-4xl font-bold text-text-primary">Free</span>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold transition-colors ${isAccent ? c.priceClass : `text-text-primary ${c.priceClass}`}`}>
                ${displayPrice}
              </span>
              <span className="text-text-tertiary text-sm">/mo + tax</span>
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

// ─────────────────────────────────────────────────────────────
// ФІНАЛЬНИЙ ВАРІАНТ (production-like preview)
// ─────────────────────────────────────────────────────────────

function PricingFinal() {
  const [annual, setAnnual] = useState(false);
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const plans = mode === 'solo' ? PLANS_V2_SOLO : PLANS_V2_TEAM;

  return (
    <section className="py-16 px-6">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">Pricing</p>
        <h2 className="text-4xl font-bold text-text-primary">Simple, transparent pricing</h2>
        <p className="text-text-secondary mt-3 text-base max-w-md mx-auto">
          Start free. No credit card required. Upgrade when you&apos;re ready.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <SoloTeamSwitch value={mode} onChange={setMode} />
        <p className="text-xs text-text-tertiary -mt-1">
          {mode === 'solo'
            ? 'For individuals working alone'
            : 'For teams collaborating together'}
        </p>
        {/* Annual / Monthly toggle */}
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-sm font-medium ${!annual ? 'text-text-primary' : 'text-text-tertiary'}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full transition-colors ${annual ? 'bg-accent' : 'bg-border-secondary'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${annual ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-text-primary' : 'text-text-tertiary'}`}>
            Annual <span className="text-success text-xs font-bold">−20%</span>
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-5 max-w-5xl mx-auto">
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} annual={annual} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-text-tertiary mt-8">
        All prices in USD. Tax may apply depending on your location.
        <br />
        Annual plans are billed once per year. You can cancel at any time.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// СТОРІНКА
// ─────────────────────────────────────────────────────────────

function PricingBlock({ plans, annual }: { plans: AnyPlan[]; annual: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} annual={annual} />
      ))}
    </div>
  );
}

function SoloTeamSwitch({ value, onChange }: { value: 'solo' | 'team'; onChange: (v: 'solo' | 'team') => void }) {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex rounded-2xl bg-bg-tertiary p-1 gap-1">
        <button
          onClick={() => onChange('solo')}
          className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
            value === 'solo'
              ? 'bg-bg-primary text-text-primary shadow-sm border border-border-primary'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          Solo
        </button>
        <button
          onClick={() => onChange('team')}
          className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
            value === 'team'
              ? 'bg-bg-primary text-text-primary shadow-sm border border-border-primary'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          Team
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ВАРІАНТИ КОНТРОЛІВ
// ─────────────────────────────────────────────────────────────

function ControlDemo({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-primary rounded-2xl border border-border-primary p-6 flex flex-col">
      <span className="text-xs font-bold text-accent uppercase tracking-wider">{label}</span>
      <p className="text-xs text-text-tertiary mt-0.5 mb-6">{desc}</p>
      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        {children}
      </div>
    </div>
  );
}

// B — Оригінал: два pill tabs однакового стилю
function ControlB() {
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [annual, setAnnual] = useState(false);
  const pill = (active: boolean) =>
    `px-6 py-2 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-bg-primary text-text-primary shadow-sm border border-border-primary' : 'text-text-tertiary hover:text-text-secondary'}`;
  return (
    <>
      <div className="inline-flex rounded-2xl bg-bg-tertiary p-1 gap-1">
        <button onClick={() => setMode('solo')} className={pill(mode === 'solo')}>Solo</button>
        <button onClick={() => setMode('team')} className={pill(mode === 'team')}>Team</button>
      </div>
      <div className="inline-flex rounded-2xl bg-bg-tertiary p-1 gap-1">
        <button onClick={() => setAnnual(false)} className={pill(!annual)}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={pill(annual)}>
          Annual <span className="text-success text-xs font-bold">−20%</span>
        </button>
      </div>
    </>
  );
}

// B1 — Один рядок: Solo·Team | Monthly·Annual в одній смузі
function ControlB1() {
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [annual, setAnnual] = useState(false);
  const pill = (active: boolean) =>
    `px-5 py-2 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-bg-primary text-text-primary shadow-sm border border-border-primary' : 'text-text-tertiary hover:text-text-secondary'}`;
  return (
    <div className="inline-flex items-center rounded-2xl bg-bg-tertiary p-1 gap-1">
      <button onClick={() => setMode('solo')} className={pill(mode === 'solo')}>Solo</button>
      <button onClick={() => setMode('team')} className={pill(mode === 'team')}>Team</button>
      <div className="w-px h-4 bg-border-secondary mx-0.5" />
      <button onClick={() => setAnnual(false)} className={pill(!annual)}>Monthly</button>
      <button onClick={() => setAnnual(true)} className={pill(annual)}>
        Annual <span className="text-success text-xs font-bold">−20%</span>
      </button>
    </div>
  );
}

// B2 — Акцент: активна пілюля заповнена акцентним кольором
function ControlB2() {
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [annual, setAnnual] = useState(false);
  const pill = (active: boolean) =>
    `px-6 py-2 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-accent text-accent-text shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`;
  return (
    <>
      <div className="inline-flex rounded-2xl bg-bg-tertiary p-1 gap-1">
        <button onClick={() => setMode('solo')} className={pill(mode === 'solo')}>Solo</button>
        <button onClick={() => setMode('team')} className={pill(mode === 'team')}>Team</button>
      </div>
      <div className="inline-flex rounded-2xl bg-bg-tertiary p-1 gap-1">
        <button onClick={() => setAnnual(false)} className={pill(!annual)}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={pill(annual)}>
          Annual{annual ? ' −20%' : <span className="text-success text-xs font-bold"> −20%</span>}
        </button>
      </div>
    </>
  );
}

// B3 — Capsule: повністю заокруглені (rounded-full)
function ControlB3() {
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [annual, setAnnual] = useState(false);
  const pill = (active: boolean) =>
    `px-6 py-2 rounded-full text-sm font-semibold transition-all ${active ? 'bg-bg-primary text-text-primary shadow-sm border border-border-primary' : 'text-text-tertiary hover:text-text-secondary'}`;
  return (
    <>
      <div className="inline-flex rounded-full bg-bg-tertiary p-1 gap-1">
        <button onClick={() => setMode('solo')} className={pill(mode === 'solo')}>Solo</button>
        <button onClick={() => setMode('team')} className={pill(mode === 'team')}>Team</button>
      </div>
      <div className="inline-flex rounded-full bg-bg-tertiary p-1 gap-1">
        <button onClick={() => setAnnual(false)} className={pill(!annual)}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={pill(annual)}>
          Annual <span className="text-success text-xs font-bold">−20%</span>
        </button>
      </div>
    </>
  );
}

// B4 — Outlined: контейнер з бордером, активна з акцент-бордером
function ControlB4() {
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [annual, setAnnual] = useState(false);
  const pill = (active: boolean) =>
    `px-6 py-2 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-accent/10 text-accent border border-accent' : 'text-text-tertiary hover:text-text-secondary'}`;
  return (
    <>
      <div className="inline-flex rounded-2xl border border-border-primary p-1 gap-1">
        <button onClick={() => setMode('solo')} className={pill(mode === 'solo')}>Solo</button>
        <button onClick={() => setMode('team')} className={pill(mode === 'team')}>Team</button>
      </div>
      <div className="inline-flex rounded-2xl border border-border-primary p-1 gap-1">
        <button onClick={() => setAnnual(false)} className={pill(!annual)}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={pill(annual)}>
          Annual <span className={annual ? 'text-xs font-bold' : 'text-success text-xs font-bold'}>−20%</span>
        </button>
      </div>
    </>
  );
}

// B5 — Compact: менший паддинг, дрібніший текст
function ControlB5() {
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [annual, setAnnual] = useState(false);
  const pill = (active: boolean) =>
    `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${active ? 'bg-bg-primary text-text-primary shadow-sm border border-border-primary' : 'text-text-tertiary hover:text-text-secondary'}`;
  return (
    <>
      <div className="inline-flex rounded-xl bg-bg-tertiary p-0.5 gap-0.5">
        <button onClick={() => setMode('solo')} className={pill(mode === 'solo')}>Solo</button>
        <button onClick={() => setMode('team')} className={pill(mode === 'team')}>Team</button>
      </div>
      <div className="inline-flex rounded-xl bg-bg-tertiary p-0.5 gap-0.5">
        <button onClick={() => setAnnual(false)} className={pill(!annual)}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={pill(annual)}>
          Annual <span className="text-success font-bold">−20%</span>
        </button>
      </div>
    </>
  );
}

// B6 — Large: більший паддинг, більше повітря
function ControlB6() {
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [annual, setAnnual] = useState(false);
  const pill = (active: boolean) =>
    `px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-bg-primary text-text-primary shadow border border-border-primary' : 'text-text-tertiary hover:text-text-secondary'}`;
  return (
    <>
      <div className="inline-flex rounded-2xl bg-bg-tertiary p-1.5 gap-1">
        <button onClick={() => setMode('solo')} className={pill(mode === 'solo')}>Solo</button>
        <button onClick={() => setMode('team')} className={pill(mode === 'team')}>Team</button>
      </div>
      <div className="inline-flex rounded-2xl bg-bg-tertiary p-1.5 gap-1">
        <button onClick={() => setAnnual(false)} className={pill(!annual)}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={pill(annual)}>
          Annual <span className="text-success text-xs font-bold">−20%</span>
        </button>
      </div>
    </>
  );
}

function ControlsShowcase() {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Варіації контролів на основі B</h2>
        <p className="text-text-tertiary mt-2 text-sm">Клікай щоб побачити активний стан</p>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <ControlDemo label="B — Оригінал" desc="Два pill tabs однакового стилю, active: bg-primary + border">
          <ControlB />
        </ControlDemo>
        <ControlDemo label="B1 — Один рядок" desc="Solo · Team | Monthly · Annual в одній pill-смузі">
          <ControlB1 />
        </ControlDemo>
        <ControlDemo label="B2 — Акцент" desc="Active пілюля заповнена accent-кольором">
          <ControlB2 />
        </ControlDemo>
        <ControlDemo label="B3 — Capsule" desc="Той самий стиль але з rounded-full — повністю круглі">
          <ControlB3 />
        </ControlDemo>
        <ControlDemo label="B4 — Outlined" desc="Контейнер з бордером, active має accent-обводку">
          <ControlB4 />
        </ControlDemo>
        <ControlDemo label="B5 — Compact" desc="Зменшений паддинг і шрифт, займає менше місця">
          <ControlB5 />
        </ControlDemo>
        <ControlDemo label="B6 — Large" desc="Збільшений паддинг, більше повітря між кнопками">
          <ControlB6 />
        </ControlDemo>
      </div>
    </div>
  );
}

export default function PreviewPricing() {
  const [activeTab, setActiveTab] = useState<'v1' | 'v2' | 'v3' | 'both' | 'final' | 'controls'>('v1');
  const [annual, setAnnual] = useState(false);
  const [mode, setMode] = useState<'solo' | 'team'>('solo');

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-6xl mx-auto p-6">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Pricing Preview</h1>
            <p className="text-sm text-text-tertiary mt-1">USA / EU · 4-tier structure</p>
          </div>
          <Link href="/" className="text-sm text-accent hover:text-accent-hover font-medium">
            &larr; Back to app
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-1 p-1 bg-bg-tertiary rounded-xl">
            {([
              { id: 'v1', label: 'V1 — Оригінал' },
              { id: 'v2', label: 'V2 — Solo/Team' },
              { id: 'v3', label: 'V3 — Best Practices 2026' },
              { id: 'both', label: 'Порівняти' },
              { id: 'final', label: '✦ Фінал' },
              { id: 'controls', label: 'Контроли' },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? 'bg-accent text-accent-text'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {activeTab !== 'final' && activeTab !== 'controls' && <Toggle annual={annual} setAnnual={setAnnual} />}
        </div>

        {/* V1 */}
        {activeTab === 'v1' && (
          <div className="bg-bg-primary rounded-2xl border border-border-primary p-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-text-primary">Choose Your Plan</h2>
              <p className="text-text-tertiary mt-2">Start free. Upgrade when you need to.</p>
            </div>
            <PricingBlock plans={PLANS_V1} annual={annual} />
          </div>
        )}

        {/* V2 */}
        {activeTab === 'v2' && (
          <div className="bg-bg-primary rounded-2xl border-2 border-accent/40 p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-text-primary">Choose Your Plan</h2>
              <p className="text-text-tertiary mt-2">Start free. Upgrade when you need to.</p>
            </div>
            <SoloTeamSwitch value={mode} onChange={setMode} />
            <p className="text-center text-xs text-text-tertiary mt-3 mb-8">
              {mode === 'solo'
                ? 'Working alone? Solo plans are optimized for individual use.'
                : 'Collaborating with others? Team plans scale with your crew.'}
            </p>
            <PricingBlock
              plans={mode === 'solo' ? PLANS_V2_SOLO : PLANS_V2_TEAM}
              annual={annual}
            />
          </div>
        )}

        {/* V3 */}
        {activeTab === 'v3' && (
          <div className="bg-bg-primary rounded-2xl border border-border-primary p-8">
            <PricingV3 />
          </div>
        )}

        {/* Both side-by-side */}
        {activeTab === 'both' && (
          <div className="space-y-6">
            <div className="bg-bg-primary rounded-2xl border border-border-primary p-6">
              <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-6">V1 — Оригінал (без Solo/Team)</p>
              <PricingBlock plans={PLANS_V1} annual={annual} />
            </div>
            <div className="bg-bg-primary rounded-2xl border-2 border-accent/40 p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-bold text-accent uppercase tracking-wider">V2 — З Solo / Team перемикачем</p>
                <SoloTeamSwitch value={mode} onChange={setMode} />
              </div>
              <PricingBlock
                plans={mode === 'solo' ? PLANS_V2_SOLO : PLANS_V2_TEAM}
                annual={annual}
              />
            </div>
          </div>
        )}

        {/* Контроли */}
        {activeTab === 'controls' && (
          <div className="bg-bg-primary rounded-2xl border border-border-primary p-8">
            <ControlsShowcase />
          </div>
        )}

        {/* Фінал */}
        {activeTab === 'final' && (
          <div className="bg-bg-primary rounded-2xl border border-border-primary overflow-hidden">
            <PricingFinal />
          </div>
        )}

      </div>
    </div>
  );
}
