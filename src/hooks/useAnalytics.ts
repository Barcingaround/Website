import { useEffect, useRef } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { trackStepView, trackWizardStart } from '../utils/analytics';

/**
 * Fires analytics events on step transitions and wizard start.
 * Mount once at WizardShell level.
 */

const STEP_NAMES = [
  'Hero',
  'Board Type',
  'Size & Quantity',
  'Customizer',
  'Add-Ons',
  'Review',
  'Checkout',
];

export function useAnalytics(): void {
  const step = useBuilderStore(s => s.currentStep);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      trackWizardStart();
      startedRef.current = true;
    }
  }, []);

  useEffect(() => {
    trackStepView(step, STEP_NAMES[step] ?? `Step ${step}`);
  }, [step]);
}
