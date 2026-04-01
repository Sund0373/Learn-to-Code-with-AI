"use client";

import WizardSidebar from "./WizardSidebar";
import WizardContent from "./WizardContent";

export default function WizardShell() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)]">
      <WizardSidebar />
      <WizardContent />
    </div>
  );
}
