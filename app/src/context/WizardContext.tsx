"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import { useWizardProgress } from "@/hooks/useWizardProgress";
import { steps } from "@/data/steps";

interface WizardContextValue {
  currentStepIndex: number;
  totalSteps: number;
  completedCount: number;
  setCurrentStep: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  markComplete: (stepId: string) => void;
  markIncomplete: (stepId: string) => void;
  isStepComplete: (stepId: string) => boolean;
  toggleComplete: (stepId: string) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const {
    lastStepIndex,
    setLastStepIndex,
    markComplete,
    markIncomplete,
    isStepComplete,
    completedCount,
  } = useWizardProgress();

  const setCurrentStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length) {
        setLastStepIndex(index);
      }
    },
    [setLastStepIndex]
  );

  const goToNext = useCallback(() => {
    setCurrentStep(lastStepIndex + 1);
  }, [lastStepIndex, setCurrentStep]);

  const goToPrevious = useCallback(() => {
    setCurrentStep(lastStepIndex - 1);
  }, [lastStepIndex, setCurrentStep]);

  const toggleComplete = useCallback(
    (stepId: string) => {
      if (isStepComplete(stepId)) {
        markIncomplete(stepId);
      } else {
        markComplete(stepId);
      }
    },
    [isStepComplete, markComplete, markIncomplete]
  );

  return (
    <WizardContext.Provider
      value={{
        currentStepIndex: lastStepIndex,
        totalSteps: steps.length,
        completedCount,
        setCurrentStep,
        goToNext,
        goToPrevious,
        markComplete,
        markIncomplete,
        isStepComplete,
        toggleComplete,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
