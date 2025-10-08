const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const Employee = require('../models/Employee');
const validateInput = require('../middleware/validateInput');
const { passwordRegex, emailRegex, idNumberRegex } = require('../utils/regexPatterns');
const { encryptField } = require('../utils/cryptoField');

const router = express.Router();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new customer
// @access  Public
router.post('/register', [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('idNumber').matches(idNumberRegex).withMessage('Invalid ID number format (must be 13 digits)'),
  body('accountNumber').isLength({ min: 10, max: 20 }).withMessage('Account number must be 10-20 characters'),
  body('email').matches(emailRegex).withMessage('Invalid email format'),
  body('password').matches(passwordRegex).withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character')
], validateInput, async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, email, password } = req.body;

    // Encrypt account number to check for existing user
    const encryptedAccountNumber = encryptField(accountNumber);

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { accountNumber: encryptedAccountNumber }
      ] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or account number' });
    }

    // Create user
    const user = await User.create({
      fullName,
      idNumber,
      accountNumber,
      email: email.toLowerCase(),
      password
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: user.getDecryptedData()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or employee
// @access  Public
router.post('/login', [
  body('accountNumber').optional().isLength({ min: 5 }).withMessage('Invalid account number'),
  body('employeeId').optional().matches(/^EMP[0-9]{6}$/).withMessage('Invalid employee ID format'),
  body('password').notEmpty().withMessage('Password is required')
], validateInput, async (req, res) => {
  try {
    const { accountNumber, employeeId, password } = req.body;

    let user;
    let role;

    // Check if employee login
    if (employeeId) {
      user = await Employee.findOne({ employeeId, isActive: true }).select('+password');
      role = 'employee';
    } 
    // Customer login
    else if (accountNumber) {
      // Encrypt the account number to search in database
      const encryptedAccountNumber = encryptField(accountNumber);
      user = await User.findOne({ accountNumber: encryptedAccountNumber, isActive: true }).select('+password');
      role = 'customer';
    } else {
      return res.status(400).json({ error: 'Please provide account number or employee ID' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, role);

    // Prepare user data
    let userData;
    if (role === 'customer') {
      userData = user.getDecryptedData();
    } else {
      userData = {
        _id: user._id,
        fullName: user.fullName,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        department: user.department
      };
    }

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// @route   POST /api/auth/register-employee
// @desc    Register new employee (for demo purposes - should be protected in production)
// @access  Public
router.post('/register-employee', [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name required'),
  body('employeeId').matches(/^EMP[0-9]{6}$/).withMessage('Employee ID must be format EMP######'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').matches(passwordRegex).withMessage('Strong password required'),
  body('department').isIn(['payments', 'verification', 'admin']).withMessage('Invalid department')
], validateInput, async (req, res) => {
  try {
    const { fullName, employeeId, email, password, department } = req.body;

    const existing = await Employee.findOne({ $or: [{ email: email.toLowerCase() }, { employeeId }] });
    if (existing) {
      return res.status(400).json({ error: 'Employee already exists with this email or employee ID' });
    }

    const employee = await Employee.create({
      fullName,
      employeeId,
      email: email.toLowerCase(),
      password,
      department
    });

    res.status(201).json({
      message: 'Employee registered successfully',
      employee: {
        _id: employee._id,
        fullName: employee.fullName,
        employeeId: employee.employeeId,
        email: employee.email,
        department: employee.department
      }
    });
  } catch (error) {
    console.error('Employee registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

module.exports = router;