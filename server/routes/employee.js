import express from 'express';
import { requireEmployee } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// List pending transactions (for employee portal)
router.get('/pending', requireEmployee, async (req, res) => {
  const txs = await Transaction.find({ status: 'pending' }).populate('customerId', 'fullName');
  // For security, return payeeAccount encrypted unless employee privileges require decryption.
  // As an internal employee, show decrypted payee:
  const result = txs.map(tx => ({
    id: tx._id,
    customerName: tx.customerId.fullName,
    amount: tx.amount,
    currency: tx.currency,
    provider: tx.provider,
    payeeAccount: tx.getPayee(),
    payeeSWIFT: tx.payeeSWIFT,
    description: tx.description,
    status: tx.status,
    createdAt: tx.createdAt
  }));
  res.json(result);
});

// Verify a transaction (employee action)
router.post('/verify/:id', requireEmployee, async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  // employee must check details and then click Verified -> here set status to 'verified' and store verifier
  tx.status = 'verified';
  tx.submittedByEmployee = req.user.sub;
  tx.verifiedAt = new Date();
  await tx.save();
  res.json({ message: 'Transaction verified' });
});

// Submit to SWIFT (employee click) — in this sample, change status to submitted
router.post('/submit/:id', requireEmployee, async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  if (tx.status !== 'verified') return res.status(400).json({ message: 'Transaction must be verified first' });
  tx.status = 'submitted';
  await tx.save();
  // Here: integration to SWIFT system would happen. Your job ends when employee clicks Submit.
  res.json({ message: 'Submitted to SWIFT (simulated)' });
});

export default router;
