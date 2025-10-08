import mongoose from 'mongoose';
import { encryptField, decryptField } from '../utils/cryptoField.js';
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  customerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  amount: { type: String, required: true },  // store as string to keep exactness; whitelist ensures format
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  payeeAccountEncrypted: { type: String, required: true },
  payeeSWIFT: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending','verified','submitted'], default: 'pending' },
  submittedByEmployee: { type: mongoose.Types.ObjectId, ref: 'Employee' },
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date }
});

TransactionSchema.methods.setPayee = function(accountNumber) {
  this.payeeAccountEncrypted = encryptField(accountNumber);
};
TransactionSchema.methods.getPayee = function() {
  return decryptField(this.payeeAccountEncrypted);
};

export default mongoose.model('Transaction', TransactionSchema);
