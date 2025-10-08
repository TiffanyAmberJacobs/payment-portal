import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { whitelistFields } from '../middleware/validateInput.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

// Registration route (customer)
router.post(
  '/register',
  whitelistFields({
    fullName: 'fullName',
    idNumber: 'idNumber',
    accountNumber: 'accountNumber',
    username: 'fullName', // username pattern reuse (you can provide specific pattern)
    password: 'password'
  }),
  async (req, res) => {
    const { fullName, idNumber, accountNumber, username, password } = req.body;
    if (!fullName || !idNumber || !accountNumber || !username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: 'Username taken' });
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ fullName, username, passwordHash: hash });
    user.setSensitive(idNumber, accountNumber);
    await user.save();
    res.status(201).json({ message: 'Registered' });
  }
);

// Login (customer)
router.post(
  '/login',
  whitelistFields({ username: 'fullName', password: 'password' }),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    // issue JWT in cookie (httpOnly, Secure)
    const token = jwt.sign({ sub: user._id, isEmployee: false }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000
    });
    res.json({ message: 'Logged in' });
  }
);

export default router;
