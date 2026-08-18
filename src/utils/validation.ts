export interface ValidationResult {
  valid: boolean;
  message?: string;
}

const NAME_REGEX = /^[A-Za-z\s'-]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Min 8 chars, at least one lowercase, one uppercase, one digit, one special char.
// Matches the shape of "Password@123" from the signup payload.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;

export const validateFirstName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "First name is required" };
  if (!NAME_REGEX.test(trimmed)) {
    return { valid: false, message: "First name must be 2-50 letters" };
  }
  return { valid: true };
};

export const validateLastName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Last name is required" };
  if (!NAME_REGEX.test(trimmed)) {
    return { valid: false, message: "Last name must be 2-50 letters" };
  }
  return { valid: true };
};

export const validateEmail = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Email is required" };
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: "Please enter a valid email" };
  }
  return { valid: true };
};

/** Stricter check, intended for the signup form. */
export const validatePassword = (value: string): ValidationResult => {
  if (!value) return { valid: false, message: "Password is required" };
  if (value.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!PASSWORD_REGEX.test(value)) {
    return {
      valid: false,
      message: "Use an uppercase, lowercase, number & special character",
    };
  }
  return { valid: true };
};

/** Looser check, intended for the login form — just confirms something was typed. */
export const validateLoginPassword = (value: string): ValidationResult => {
  if (!value) return { valid: false, message: "Password is required" };
  if (value.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  return { valid: true };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) return { valid: false, message: "Please confirm your password" };
  if (password !== confirmPassword) return { valid: false, message: "Passwords do not match" };
  return { valid: true };
};

export const validateAgreeToTerms = (checked: boolean): ValidationResult => {
  if (!checked) return { valid: false, message: "You must agree to the terms to continue" };
  return { valid: true };
};