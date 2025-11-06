# 🏦 International Payments Portal

A secure full-stack CRUD system for managing international payments with customer and employee portals.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)
![License](https://img.shields.io/badge/license-ISC-blue)

## 🚀 Features

### Customer Portal
- ✅ User registration with encrypted data
- 🔐 Secure login with JWT authentication
- 💸 Make international payments
- 📊 View payment history
- ✏️ Edit/delete pending payments

### Employee Portal
- 👥 Employee authentication
- 📋 View all customer transactions
- ✅ Verify/approve payments
- 🔍 Search and filter transactions
- 📈 View payment statistics

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Axios
- React Router DOM

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation

**Security:**
- Helmet.js for security headers
- Rate limiting
- CORS protection
- Field-level encryption
- Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd intl-payments