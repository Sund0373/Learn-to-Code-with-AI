/**
 * Validation utilities.
 * Each validator returns { valid: boolean; message: string }.
 * Compose them in your form handlers or API routes.
 */

export interface ValidationResult {
  valid: boolean;
  message: string;
}

const ok  = (): ValidationResult => ({ valid: true,  message: "" });
const err = (message: string): ValidationResult => ({ valid: false, message });

// ─── Primitives ────────────────────────────────────────────────────────────────

export function required(value: unknown, label = "This field"): ValidationResult {
  const empty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0);
  return empty ? err(`${label} is required`) : ok();
}

export function minLength(value: string, min: number, label = "This field"): ValidationResult {
  return value.trim().length >= min
    ? ok()
    : err(`${label} must be at least ${min} characters`);
}

export function maxLength(value: string, max: number, label = "This field"): ValidationResult {
  return value.trim().length <= max
    ? ok()
    : err(`${label} must be ${max} characters or fewer`);
}

// ─── Formats ───────────────────────────────────────────────────────────────────

export function isEmail(value: string): ValidationResult {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value.trim()) ? ok() : err("Enter a valid email address");
}

export function isUrl(value: string): ValidationResult {
  try {
    new URL(value);
    return ok();
  } catch {
    return err("Enter a valid URL (include https://)");
  }
}

export function isPhone(value: string): ValidationResult {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return ok();
  if (digits.length === 11 && digits.startsWith("1")) return ok();
  return err("Enter a valid 10-digit phone number");
}

/** Format a US phone string to E.164 (+1XXXXXXXXXX). */
export function formatPhoneE164(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return "";
}

// ─── Numbers ───────────────────────────────────────────────────────────────────

export function isNumber(value: string, label = "This field"): ValidationResult {
  return isNaN(Number(value)) ? err(`${label} must be a number`) : ok();
}

export function inRange(
  value: number,
  min: number,
  max: number,
  label = "This field"
): ValidationResult {
  return value >= min && value <= max
    ? ok()
    : err(`${label} must be between ${min} and ${max}`);
}

// ─── Composer ──────────────────────────────────────────────────────────────────

/**
 * Run multiple validators in order. Returns the first failure, or ok().
 *
 * @example
 * const result = validate(email, [required, isEmail]);
 */
export function validate(
  value: string,
  validators: Array<(v: string) => ValidationResult>
): ValidationResult {
  for (const validator of validators) {
    const result = validator(value);
    if (!result.valid) return result;
  }
  return ok();
}
