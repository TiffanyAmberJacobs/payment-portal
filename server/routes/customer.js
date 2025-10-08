import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { whitelistFields } from '../middleware/validateInput.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const router = express.Router();

// Create a payment
router.post(
  '/pay',
  requireAuth,
  whitelistFields({
    amount: 'amount',
    currency: 'currency',
    provider: 'provider',
    payeeAccount: 'accountNumber',
    payeeSWIFT: 'swift',
    description: 'description'
  }),
  async (req, res) => {
    const { amount, currency, provider, payeeAccount, payeeSWIFT, description } = req.body;
    const tx = new Transaction({
      customerId: req.user.sub,
      amount,
      currency,
      provider,
      payeeSWIFT,
      description
    });
    tx.setPayee(payeeAccount);
    await tx.save();
    // Audit log note could go here
    res.status(201).json({ message: 'Payment created', transactionId: tx._id });
  }
);

// Get customer's transactions
router.get('/my-transactions', requireAuth, async (req, res) => {
  const txs = await Transaction.find({ customerId: req.user.sub }).select('-payeeAccountEncrypted');
  res.json(txs);
});

export default router;
