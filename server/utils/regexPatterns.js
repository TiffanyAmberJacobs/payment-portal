/**
 * Regex patterns for input validation
 */

// Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// South African ID Number (13 digits)
const idNumberRegex = /^[0-9]{13}$/;

// SWIFT Code (8 or 11 characters)
const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

// Account Number (10-20 alphanumeric)
const accountNumberRegex = /^[A-Za-z0-9]{10,20}$/;

// Employee ID (EMP followed by 6 digits)
const employeeIdRegex = /^EMP[0-9]{6}$/;

module.exports = {
  passwordRegex,
  emailRegex,
  idNumberRegex,
  swiftCodeRegex,
  accountNumberRegex,
  employeeIdRegex
};