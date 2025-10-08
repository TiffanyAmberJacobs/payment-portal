// Strict whitelist regex patterns
export const patterns = {
  fullName: /^[A-Za-z\s'\-]{2,100}$/,           // letters, spaces, apostrophes, hyphens
  idNumber: /^\d{13}$/,                         // South African ID is 13 digits (example)
  accountNumber: /^\d{8,20}$/,                  // numeric account, 8-20 digits
  password: /^[\S]{8,128}$/,                    // no whitespace, 8-128 chars (we store only hash)
  amount: /^\d+(\.\d{1,2})?$/,                  // decimal with up to 2 dp
  currency: /^[A-Z]{3}$/,                       // ISO currency code (USD, ZAR, EUR)
  swift: /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/, // SWIFT/BIC strict-ish
  provider: /^[A-Za-z0-9\s\-\_\.]{1,50}$/,
  description: /^[\w\s\-\.,'()]{0,200}$/
};
