'use client';

import { useState } from 'react';
import Link from 'next/link';

// Icons
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

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

const PLANS = {
  basic: {
    name: 'Basic',
    price: 5,
    yearlyPrice: 4,
    description: 'For individuals',
    features: [
      'Up to 10 projects',
      '50 tasks per project',
      'Basic Gantt chart',
      'Email support',
      '1 team member',
    ],
  },
  pro: {
    name: 'Pro',
    price: 20,
    yearlyPrice: 16,
    description: 'For growing teams',
    popular: true,
    features: [
      'Unlimited projects',
      'Unlimited tasks',
      'Advanced Gantt chart',
      'Priority support',
      'Up to 10 team members',
      'Custom themes',
      'Export to PDF/Excel',
      'Task dependencies',
    ],
  },
  platinum: {
    name: 'Platinum',
    price: 100,
    yearlyPrice: 80,
    description: 'For enterprises',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'White-label branding',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'Advanced analytics',
      'SSO authentication',
      'Priority feature requests',
    ],
  },
};

// ===== VARIANT F: Classic + Hover Effects (FAVORITE) =====
function PricingVariantF() {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Choose Your Plan</h2>
        <p className="text-text-tertiary mt-2">Simple pricing for everyone</p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Basic */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-success hover:shadow-xl hover:shadow-success/10">
          <h3 className="text-lg font-bold text-text-primary">{PLANS.basic.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-text-primary group-hover:text-success transition-colors">${PLANS.basic.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.basic.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-border-secondary text-sm font-semibold text-text-primary hover:bg-bg-hover group-hover:border-success group-hover:text-success transition-all">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.basic.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-success-light transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-success transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro - Popular */}
        <div className="group rounded-2xl border-2 border-accent bg-bg-primary p-6 relative shadow-lg shadow-accent/10 hover:shadow-xl hover:shadow-accent/20 transition-all">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </div>
          <h3 className="text-lg font-bold text-text-primary">{PLANS.pro.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-accent">${PLANS.pro.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.pro.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl bg-accent text-sm font-semibold text-accent-text hover:bg-accent-hover transition-colors">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.pro.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-accent-light flex items-center justify-center">
                  <CheckIcon className="h-3 w-3 text-accent" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Platinum */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-text-primary">{PLANS.platinum.name}</h3>
            <CrownIcon className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-text-primary group-hover:text-purple-500 transition-colors">${PLANS.platinum.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.platinum.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-purple-500 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
            Contact Sales
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.platinum.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-purple-500 transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ===== VARIANT J: F + Annual Toggle =====
function PricingVariantJ() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Choose Your Plan</h2>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className={`text-sm font-medium ${!annual ? 'text-text-primary' : 'text-text-tertiary'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full transition-colors ${annual ? 'bg-accent' : 'bg-border-secondary'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${annual ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-text-primary' : 'text-text-tertiary'}`}>
            Annual{' '}
            <span className="text-success text-xs font-bold">−20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Basic */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-success hover:shadow-xl hover:shadow-success/10">
          <h3 className="text-lg font-bold text-text-primary">{PLANS.basic.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-text-primary group-hover:text-success transition-colors">
              ${annual ? PLANS.basic.yearlyPrice : PLANS.basic.price}
            </span>
            <span className="text-text-tertiary">/month</span>
          </div>
          {annual && <p className="text-xs text-success mt-1">Billed ${PLANS.basic.yearlyPrice * 12}/year</p>}
          <p className="text-sm text-text-tertiary mt-2">{PLANS.basic.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-border-secondary text-sm font-semibold text-text-primary hover:bg-bg-hover group-hover:border-success group-hover:text-success transition-all">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.basic.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-success-light transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-success transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="group rounded-2xl border-2 border-accent bg-bg-primary p-6 relative shadow-lg shadow-accent/10 hover:shadow-xl hover:shadow-accent/20 transition-all">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </div>
          <h3 className="text-lg font-bold text-text-primary">{PLANS.pro.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-accent">
              ${annual ? PLANS.pro.yearlyPrice : PLANS.pro.price}
            </span>
            <span className="text-text-tertiary">/month</span>
          </div>
          {annual && <p className="text-xs text-success mt-1">Billed ${PLANS.pro.yearlyPrice * 12}/year</p>}
          <p className="text-sm text-text-tertiary mt-2">{PLANS.pro.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl bg-accent text-sm font-semibold text-accent-text hover:bg-accent-hover transition-colors">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.pro.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-accent-light flex items-center justify-center">
                  <CheckIcon className="h-3 w-3 text-accent" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Platinum */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-text-primary">{PLANS.platinum.name}</h3>
            <CrownIcon className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-text-primary group-hover:text-purple-500 transition-colors">
              ${annual ? PLANS.platinum.yearlyPrice : PLANS.platinum.price}
            </span>
            <span className="text-text-tertiary">/month</span>
          </div>
          {annual && <p className="text-xs text-success mt-1">Billed ${PLANS.platinum.yearlyPrice * 12}/year</p>}
          <p className="text-sm text-text-tertiary mt-2">{PLANS.platinum.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-purple-500 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
            Contact Sales
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.platinum.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-purple-500 transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ===== VARIANT K: F + Icon Headers =====
function PricingVariantK() {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Choose Your Plan</h2>
        <p className="text-text-tertiary mt-2">Simple pricing for everyone</p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Basic */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-success hover:shadow-xl hover:shadow-success/10">
          <div className="h-11 w-11 rounded-xl bg-bg-tertiary flex items-center justify-center group-hover:bg-success-light transition-colors">
            <RocketIcon className="h-5 w-5 text-text-tertiary group-hover:text-success transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-4">{PLANS.basic.name}</h3>
          <div className="mt-3">
            <span className="text-4xl font-bold text-text-primary group-hover:text-success transition-colors">${PLANS.basic.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.basic.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-border-secondary text-sm font-semibold text-text-primary hover:bg-bg-hover group-hover:border-success group-hover:text-success transition-all">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.basic.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-success-light transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-success transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="group rounded-2xl border-2 border-accent bg-bg-primary p-6 relative shadow-lg shadow-accent/10 hover:shadow-xl hover:shadow-accent/20 transition-all">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </div>
          <div className="h-11 w-11 rounded-xl bg-accent-light flex items-center justify-center">
            <ZapIcon className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-4">{PLANS.pro.name}</h3>
          <div className="mt-3">
            <span className="text-4xl font-bold text-accent">${PLANS.pro.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.pro.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl bg-accent text-sm font-semibold text-accent-text hover:bg-accent-hover transition-colors">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.pro.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-accent-light flex items-center justify-center">
                  <CheckIcon className="h-3 w-3 text-accent" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Platinum */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10">
          <div className="h-11 w-11 rounded-xl bg-bg-tertiary flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <ShieldIcon className="h-5 w-5 text-text-tertiary group-hover:text-purple-500 transition-colors" />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <h3 className="text-lg font-bold text-text-primary">{PLANS.platinum.name}</h3>
            <CrownIcon className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-3">
            <span className="text-4xl font-bold text-text-primary group-hover:text-purple-500 transition-colors">${PLANS.platinum.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.platinum.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-purple-500 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
            Contact Sales
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.platinum.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-purple-500 transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ===== VARIANT L: F + Elevated Pro + Filled Hover Buttons =====
function PricingVariantL() {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Choose Your Plan</h2>
        <p className="text-text-tertiary mt-2">Simple pricing for everyone</p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
        {/* Basic */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-success hover:shadow-xl hover:shadow-success/10 mt-4">
          <h3 className="text-lg font-bold text-text-primary">{PLANS.basic.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-text-primary group-hover:text-success transition-colors">${PLANS.basic.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.basic.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-border-secondary text-sm font-semibold text-text-primary group-hover:bg-success group-hover:border-success group-hover:text-white transition-all">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.basic.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-success-light transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-success transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro — elevated */}
        <div className="group rounded-2xl border-2 border-accent bg-bg-primary p-6 relative shadow-2xl shadow-accent/20 hover:shadow-accent/30 transition-all -mt-2 scale-[1.02]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </div>
          <h3 className="text-lg font-bold text-text-primary">{PLANS.pro.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-accent">${PLANS.pro.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.pro.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl bg-accent text-sm font-semibold text-accent-text hover:bg-accent-hover transition-colors">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.pro.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-accent-light flex items-center justify-center">
                  <CheckIcon className="h-3 w-3 text-accent" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Platinum */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 mt-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-text-primary">{PLANS.platinum.name}</h3>
            <CrownIcon className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-text-primary group-hover:text-purple-500 transition-colors">${PLANS.platinum.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.platinum.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-purple-500 text-sm font-semibold text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-all">
            Contact Sales
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.platinum.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-purple-500 transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ===== VARIANT M: F + Colored Tag + Star Rating =====
function PricingVariantM() {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Choose Your Plan</h2>
        <p className="text-text-tertiary mt-2">Simple pricing for everyone</p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Basic */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-success hover:shadow-xl hover:shadow-success/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-success bg-success-light px-2.5 py-1 rounded-full">STARTER</span>
            <div className="flex gap-0.5">
              {[1,2,3].map(i => <StarIcon key={i} className="h-3.5 w-3.5 text-warning" />)}
            </div>
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-4">{PLANS.basic.name}</h3>
          <div className="mt-2">
            <span className="text-4xl font-bold text-text-primary group-hover:text-success transition-colors">${PLANS.basic.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.basic.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-border-secondary text-sm font-semibold text-text-primary hover:bg-bg-hover group-hover:border-success group-hover:text-success transition-all">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.basic.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-success-light transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-success transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="group rounded-2xl border-2 border-accent bg-bg-primary p-6 relative shadow-lg shadow-accent/10 hover:shadow-xl hover:shadow-accent/20 transition-all">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent bg-accent-light px-2.5 py-1 rounded-full">BEST VALUE</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <StarIcon key={i} className="h-3.5 w-3.5 text-warning" />)}
            </div>
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-4">{PLANS.pro.name}</h3>
          <div className="mt-2">
            <span className="text-4xl font-bold text-accent">${PLANS.pro.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.pro.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl bg-accent text-sm font-semibold text-accent-text hover:bg-accent-hover transition-colors">
            Get Started
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.pro.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-accent-light flex items-center justify-center">
                  <CheckIcon className="h-3 w-3 text-accent" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Platinum */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">ENTERPRISE</span>
            <CrownIcon className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-4">{PLANS.platinum.name}</h3>
          <div className="mt-2">
            <span className="text-4xl font-bold text-text-primary group-hover:text-purple-500 transition-colors">${PLANS.platinum.price}</span>
            <span className="text-text-tertiary">/month</span>
          </div>
          <p className="text-sm text-text-tertiary mt-2">{PLANS.platinum.description}</p>
          <button className="mt-6 w-full py-3 rounded-xl border border-purple-500 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
            Contact Sales
          </button>
          <ul className="mt-6 space-y-3">
            {PLANS.platinum.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-purple-500 transition-colors" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ===== VARIANT N: F + Divider + Feature Count Badge =====
function PricingVariantN() {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Choose Your Plan</h2>
        <p className="text-text-tertiary mt-2">Simple pricing for everyone</p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Basic */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary overflow-hidden transition-all hover:border-success hover:shadow-xl hover:shadow-success/10">
          {/* Top accent strip */}
          <div className="h-1 bg-bg-tertiary group-hover:bg-success transition-colors" />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">{PLANS.basic.name}</h3>
                <p className="text-sm text-text-tertiary mt-0.5">{PLANS.basic.description}</p>
              </div>
              <span className="text-xs font-semibold text-text-tertiary bg-bg-tertiary px-2 py-1 rounded-lg group-hover:bg-success-light group-hover:text-success transition-colors">
                {PLANS.basic.features.length} features
              </span>
            </div>
            <div className="mt-5">
              <span className="text-4xl font-bold text-text-primary group-hover:text-success transition-colors">${PLANS.basic.price}</span>
              <span className="text-text-tertiary">/month</span>
            </div>
            <button className="mt-5 w-full py-3 rounded-xl border border-border-secondary text-sm font-semibold text-text-primary hover:bg-bg-hover group-hover:border-success group-hover:text-success transition-all">
              Get Started
            </button>
            <div className="mt-6 pt-6 border-t border-border-primary">
              <ul className="space-y-3">
                {PLANS.basic.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-success-light transition-colors">
                      <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-success transition-colors" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pro */}
        <div className="group rounded-2xl border-2 border-accent bg-bg-primary overflow-hidden relative shadow-lg shadow-accent/10 hover:shadow-xl hover:shadow-accent/20 transition-all">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-full z-10">
            POPULAR
          </div>
          {/* Top accent strip */}
          <div className="h-1 bg-accent" />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">{PLANS.pro.name}</h3>
                <p className="text-sm text-text-tertiary mt-0.5">{PLANS.pro.description}</p>
              </div>
              <span className="text-xs font-semibold text-accent bg-accent-light px-2 py-1 rounded-lg">
                {PLANS.pro.features.length} features
              </span>
            </div>
            <div className="mt-5">
              <span className="text-4xl font-bold text-accent">${PLANS.pro.price}</span>
              <span className="text-text-tertiary">/month</span>
            </div>
            <button className="mt-5 w-full py-3 rounded-xl bg-accent text-sm font-semibold text-accent-text hover:bg-accent-hover transition-colors">
              Get Started
            </button>
            <div className="mt-6 pt-6 border-t border-border-primary">
              <ul className="space-y-3">
                {PLANS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="h-5 w-5 rounded-full bg-accent-light flex items-center justify-center">
                      <CheckIcon className="h-3 w-3 text-accent" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Platinum */}
        <div className="group rounded-2xl border border-border-primary bg-bg-primary overflow-hidden transition-all hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10">
          {/* Top accent strip */}
          <div className="h-1 bg-bg-tertiary group-hover:bg-purple-500 transition-colors" />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">{PLANS.platinum.name}</h3>
                <p className="text-sm text-text-tertiary mt-0.5">{PLANS.platinum.description}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-text-tertiary bg-bg-tertiary px-2 py-1 rounded-lg group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                  {PLANS.platinum.features.length} features
                </span>
                <CrownIcon className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div className="mt-5">
              <span className="text-4xl font-bold text-text-primary group-hover:text-purple-500 transition-colors">${PLANS.platinum.price}</span>
              <span className="text-text-tertiary">/month</span>
            </div>
            <button className="mt-5 w-full py-3 rounded-xl border border-purple-500 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
              Contact Sales
            </button>
            <div className="mt-6 pt-6 border-t border-border-primary">
              <ul className="space-y-3">
                {PLANS.platinum.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="h-5 w-5 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <CheckIcon className="h-3 w-3 text-text-tertiary group-hover:text-purple-500 transition-colors" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPricing() {
  const [activeVariant, setActiveVariant] = useState<string>('F');

  const variants = [
    { id: 'F', name: 'Classic Hover (Favorite)', component: <PricingVariantF /> },
    { id: 'J', name: 'F + Annual Toggle', component: <PricingVariantJ /> },
    { id: 'K', name: 'F + Icon Headers', component: <PricingVariantK /> },
    { id: 'L', name: 'F + Elevated Pro', component: <PricingVariantL /> },
    { id: 'M', name: 'F + Tags & Stars', component: <PricingVariantM /> },
    { id: 'N', name: 'F + Top Strip', component: <PricingVariantN /> },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Pricing Page Variants</h1>
            <p className="text-sm text-text-tertiary mt-1">Choose your favorite design</p>
          </div>
          <Link href="/" className="text-sm text-accent hover:text-accent-hover font-medium">
            &larr; Back to app
          </Link>
        </div>

        {/* Variant Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-bg-tertiary rounded-xl w-fit">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVariant(v.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeVariant === v.id
                  ? 'bg-accent text-accent-text'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              {v.id}: {v.name}
            </button>
          ))}
        </div>

        {/* Active Variant */}
        <div className="bg-bg-primary rounded-2xl border border-border-primary p-6">
          {variants.find(v => v.id === activeVariant)?.component}
        </div>

        {/* All Variants Grid */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-text-primary mb-6">All Variants Overview</h2>
          <div className="space-y-8">
            {variants.map((v) => (
              <div key={v.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    activeVariant === v.id ? 'bg-accent text-accent-text' : 'bg-bg-tertiary text-text-secondary'
                  }`}>
                    {v.id}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary">{v.name}</h3>
                  {activeVariant === v.id && (
                    <span className="text-xs text-accent font-medium">Currently viewing</span>
                  )}
                </div>
                <div className="bg-bg-primary rounded-2xl border border-border-primary p-4 overflow-hidden">
                  <div className="transform scale-[0.6] origin-top-left w-[166%]">
                    {v.component}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
