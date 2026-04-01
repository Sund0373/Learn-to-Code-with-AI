import { StepData } from "../types";
import { step1Welcome } from "./step1-welcome";
import { step2Git } from "./step2-git";
import { step3Env } from "./step3-env";
import { step4Firebase } from "./step4-firebase";
import { step5Auth } from "./step5-auth";
import { step6Api } from "./step6-api";
import { step7Scraping } from "./step7-scraping";
import { step8Llm } from "./step8-llm";
import { step9Agents } from "./step9-agents";

export const steps: StepData[] = [
  step1Welcome,
  step2Git,
  step3Env,
  step4Firebase,
  step5Auth,
  step6Api,
  step7Scraping,
  step8Llm,
  step9Agents,
];
