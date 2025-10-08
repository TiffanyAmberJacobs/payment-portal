import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { encryptField, decryptField } from '../utils/cryptoField.js';
const { Schema } = mongoose;

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  idNumberEncrypted: { type: String, required: true },   // encrypted
  accountEncrypted: { type: String, required: true },    // encrypted
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Virtuals to set/get decrypted fields
UserSchema.methods.setSensitive = function (idNumber, accountNumber) {
  this.idNumberEncrypted = encryptField(idNumber);
  this.accountEncrypted = encryptField(accountNumber);
};
UserSchema.methods.getSensitive = function () {
  return {
    idNumber: decryptField(this.idNumberEncrypted),
    accountNumber: decryptField(this.accountEncrypted)
  };
};

UserSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model('User', UserSchema);
