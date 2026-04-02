"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useWizard } from "@/context/WizardContext";
import { steps } from "@/data/steps";
import StepRenderer from "./StepRenderer";
import Button from "@/components/ui/Button";
import Confetti from "./Confetti";

export default function WizardContent() {
  const {
    currentStepIndex,
    totalSteps,
    goToNext,
    goToPrevious,
    isStepComplete,
    toggleComplete,
  } = useWizard();

  const contentRef = useRef<HTMLDivElement>(null);
  const step = steps[currentStepIndex];
  const complete = isStepComplete(step.id);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [currentStepIndex]);

  const handleComplete = () => {
    if (!complete) {
      setShowConfetti(true);
    }
    toggleComplete(step.id);
  };

  const handleConfettiDone = useCallback(() => {
    setShowConfetti(false);
  }, []);

  return (
    <div ref={contentRef} className="flex-1 overflow-y-auto">
      {showConfetti && <Confetti onDone={handleConfettiDone} />}

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Step header */}
        <div className="mb-8">
          <span className="text-xs font-medium uppercase tracking-wide text-action-primary">
            Step {step.stepNumber} of {totalSteps}
          </span>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {step.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500">{step.subtitle}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ~{step.estimatedMinutes} min
          </div>
        </div>

        {/* Step content */}
        <StepRenderer sections={step.sections} />

        {/* Bottom actions */}
        <div className="mt-12 mb-16 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleComplete}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              complete
                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:scale-105 active:scale-95"
            }`}
          >
            {complete ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="h-4 w-4 rounded-full border-2 border-gray-300" />
            )}
            {complete ? "Completed" : "Mark as complete"}
          </button>

          <div className="flex gap-3">
            {currentStepIndex > 0 && (
              <Button variant="secondary" size="md" onClick={goToPrevious}>
                Previous
              </Button>
            )}
            {currentStepIndex < totalSteps - 1 && (
              <Button variant="primary" size="md" onClick={goToNext}>
                Next step
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
