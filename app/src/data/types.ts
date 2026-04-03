export type ContentBlockType =
  | "text"
  | "code"
  | "terminal"
  | "file-tree"
  | "callout"
  | "checklist"
  | "link"
  | "component"
  | "image";

export interface ContentBlock {
  type: ContentBlockType;
  content: string;
  language?: string;
  label?: string;
  variant?: "info" | "warning" | "tip" | "success";
  items?: string[];
}

export interface Section {
  title: string;
  blocks: ContentBlock[];
}

export interface StepData {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  sections: Section[];
}
