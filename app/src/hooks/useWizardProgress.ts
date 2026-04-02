"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "wizard-progress";

interface WizardProgress {
  completedSteps: string[];
  lastStepIndex: number;
}

function loadProgress(): WizardProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WizardProgress;
      return {
        completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
        lastStepIndex: typeof parsed.lastStepIndex === "number" ? parsed.lastStepIndex : 0,
      };
    }
  } catch {
    // corrupted data — start fresh
  }
  return { completedSteps: [], lastStepIndex: 0 };
}

export function useWizardProgress() {
  // Start with defaults to match server render — avoids hydration mismatch
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [lastStepIndex, setLastStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage after mount
  useEffect(() => {
    const saved = loadProgress();
    setCompletedSteps(new Set(saved.completedSteps));
    setLastStepIndex(saved.lastStepIndex);
    setHydrated(true);
  }, []);

  // Persist to localStorage on changes (skip the initial default state)
  useEffect(() => {
    if (!hydrated) return;
    const data: WizardProgress = {
      completedSteps: Array.from(completedSteps),
      lastStepIndex,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [completedSteps, lastStepIndex, hydrated]);

  const markComplete = useCallback((stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
  }, []);

  const markIncomplete = useCallback((stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.delete(stepId);
      return next;
    });
  }, []);

  const isStepComplete = useCallback(
    (stepId: string) => completedSteps.has(stepId),
    [completedSteps]
  );

  return {
    completedSteps,
    lastStepIndex,
    setLastStepIndex,
    markComplete,
    markIncomplete,
    isStepComplete,
    completedCount: completedSteps.size,
  };
}
