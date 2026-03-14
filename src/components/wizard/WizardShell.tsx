import { useBuilderStore } from '../../store/builderStore';
import Step0Hero from './Step0Hero';
import Step1BoardType from './Step1BoardType';
import Step2SizeQuantity from './Step2SizeQuantity';
import Step3Customizer from '../customizer/Step3Customizer';
import Step4AddOns from './Step4AddOns';
import Step5Review from './Step5Review';
import Step6Checkout from './Step6Checkout';
import styles from './WizardShell.module.css';

const STEPS = [
  { label: 'Start', short: '1' },
  { label: 'Type', short: '2' },
  { label: 'Size', short: '3' },
  { label: 'Customize', short: '4' },
  { label: 'Add-Ons', short: '5' },
  { label: 'Review', short: '6' },
  { label: 'Checkout', short: '7' },
];

export default function WizardShell() {
  const currentStep = useBuilderStore(s => s.currentStep);

  const progressPct = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className={`build-your-board-page ${styles.shell}`}>
      {/* Progress bar — hidden on hero */}
      {currentStep > 0 && (
        <header className={styles.progressHeader} role="banner">
          <div className={styles.brandLogo}>
            <span className={styles.brandText}>The Board Miami</span>
          </div>
          <nav className={styles.stepNav} aria-label="Wizard steps">
            <div className={styles.progressTrack} role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={0}
              aria-valuemax={STEPS.length - 1}
              aria-label={`Step ${currentStep + 1} of ${STEPS.length}`}
            >
              <div
                className={`${styles.progressFill} progress-bar-fill`}
                style={{ width: `${progressPct}%` }}
              />
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`${styles.stepDot} ${i <= currentStep ? styles.stepDotActive : ''}`}
                  style={{ left: `${(i / (STEPS.length - 1)) * 100}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className={styles.stepLabels} aria-hidden="true">
              {STEPS.map((step, i) => (
                <span
                  key={i}
                  className={`${styles.stepLabel} ${i === currentStep ? styles.stepLabelActive : ''} ${i < currentStep ? styles.stepLabelDone : ''}`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </nav>
        </header>
      )}

      <main className={styles.main}>
        {currentStep === 0 && <Step0Hero />}
        {currentStep === 1 && <Step1BoardType />}
        {currentStep === 2 && <Step2SizeQuantity />}
        {currentStep === 3 && <Step3Customizer />}
        {currentStep === 4 && <Step4AddOns />}
        {currentStep === 5 && <Step5Review />}
        {currentStep === 6 && <Step6Checkout />}
      </main>
    </div>
  );
}
