import mongoose from 'mongoose';
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  username: { type: String, required: true, unique: true },
  // employees pre-registered in DB: store hashed password too
  passwordHash: { type: String, required: true },
  fullName: { type: String },
  role: { type: String, default: 'processor' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Employee', EmployeeSchema);
