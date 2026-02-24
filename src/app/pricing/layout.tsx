import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pricing — Planify',
  description: 'Simple, transparent pricing for teams of all sizes. Start free, scale as you grow.',
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
