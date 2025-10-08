import { patterns } from '../utils/regexPatterns.js';

export function whitelistFields(rules) {
  // rules: object mapping field -> pattern key in patterns
  return (req, res, next) => {
    const source = req.method === 'GET' ? req.query : req.body;
    for (const [field, patName] of Object.entries(rules)) {
      const val = source[field];
      if (typeof val === 'undefined') continue; // allow missing where allowed
      const regex = patterns[patName];
      if (!regex) {
        return res.status(500).json({ message: `Server misconfigured: regex ${patName}` });
      }
      if (!regex.test(String(val))) {
        return res.status(400).json({ message: `Invalid ${field}` });
      }
    }
    next();
  };
}
