"use client";

import { WizardProvider } from "@/context/WizardContext";
import WizardShell from "@/components/learn/WizardShell";

export default function LearnPage() {
  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  );
}
