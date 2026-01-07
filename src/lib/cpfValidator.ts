/**
 * Validates a Brazilian CPF number using the official algorithm
 * @param cpf - CPF string (can contain formatting)
 * @returns true if valid, false otherwise
 */
export function validateCPF(cpf: string): boolean {
  // Remove non-digits
  const digits = cpf.replace(/\D/g, "");

  // Must have exactly 11 digits
  if (digits.length !== 11) {
    return false;
  }

  // Check for known invalid patterns (all same digit)
  if (/^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(digits[9])) {
    return false;
  }

  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(digits[10])) {
    return false;
  }

  return true;
}
