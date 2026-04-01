"use client";

import { useState, useEffect } from "react";
import { useWizard } from "@/context/WizardContext";
import { steps } from "@/data/steps";

const SIDEBAR_KEY = "wizard-sidebar-expanded";

export default function WizardSidebar() {
  const {
    currentStepIndex,
    totalSteps,
    completedCount,
    setCurrentStep,
    isStepComplete,
  } = useWizard();

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Default: expanded on wide screens, collapsed on narrow
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) {
      setExpanded(stored === "true");
    } else {
      setExpanded(window.innerWidth >= 1100);
    }
  }, []);

  const toggle = () => {
    setExpanded((prev) => {
      localStorage.setItem(SIDEBAR_KEY, String(!prev));
      return !prev;
    });
  };

  const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200 ${
        expanded ? "w-56" : "w-14"
      }`}
    >
      {/* Toggle + progress */}
      <div className={`border-b border-gray-100 ${expanded ? "px-3 py-3" : "px-2 py-3"}`}>
        <button
          onClick={toggle}
          className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg
            className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {expanded && (
            <span className="text-xs font-medium text-gray-500">
              {completedCount}/{totalSteps} done
            </span>
          )}
        </button>

        {/* Progress bar */}
        <div className={`mt-2 ${expanded ? "" : "px-1"}`}>
          <div className="h-1 w-full rounded-full bg-gray-200">
            <div
              className="h-1 rounded-full bg-action-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isComplete = isStepComplete(step.id);

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              title={expanded ? undefined : `${step.stepNumber}. ${step.title}`}
              className={`flex w-full items-center gap-2.5 transition-colors ${
                expanded
                  ? `rounded-md mx-2 px-2.5 py-2 text-left text-sm mb-0.5 ${
                      isCurrent
                        ? "bg-blue-50 text-action-primary font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  : `justify-center py-2.5 ${
                      isCurrent
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`
              }`}
            >
              {/* Step number / check */}
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isComplete
                    ? "bg-green-100 text-green-700"
                    : isCurrent
                    ? "bg-action-primary text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isComplete ? (
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.stepNumber
                )}
              </span>

              {/* Step title (expanded only) */}
              {expanded && (
                <span className="truncate leading-tight text-[13px]">
                  {step.title}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
