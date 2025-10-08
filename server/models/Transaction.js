const mongoose = require('mongoose');
const { encryptField, decryptField } = require('../utils/cryptoField');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'ZAR', 'JPY'],
    default: 'USD'
  },
  provider: {
    type: String,
    required: true,
    enum: ['SWIFT', 'PayPal', 'Western Union', 'MoneyGram']
  },
  recipientAccount: {
    type: String,
    required: [true, 'Recipient account is required']
  },
  swiftCode: {
    type: String,
    validate: {
      validator: function(v) {
        if (this.provider === 'SWIFT' && v) {
          return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(v);
        }
        return true;
      },
      message: 'Invalid SWIFT code format'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  verifiedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Encrypt sensitive fields before saving
transactionSchema.pre('save', function(next) {
  if (this.isModified('recipientAccount')) {
    this.recipientAccount = encryptField(this.recipientAccount);
  }
  if (this.isModified('swiftCode') && this.swiftCode) {
    this.swiftCode = encryptField(this.swiftCode);
  }
  next();
});

// Method to get decrypted transaction
transactionSchema.methods.getDecryptedData = function() {
  return {
    _id: this._id,
    userId: this.userId,
    amount: this.amount,
    currency: this.currency,
    provider: this.provider,
    recipientAccount: decryptField(this.recipientAccount),
    swiftCode: this.swiftCode ? decryptField(this.swiftCode) : null,
    status: this.status,
    verifiedBy: this.verifiedBy,
    verifiedAt: this.verifiedAt,
    notes: this.notes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Transaction', transactionSchema);