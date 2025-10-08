import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// specialized employee auth (employee role must be set in JWT)
export function requireEmployee(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user?.isEmployee) {
      return res.status(403).json({ message: 'Employee access only' });
    }
    next();
  });
}
