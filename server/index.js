import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import { connectDB } from './Config/db.js';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customer.js';
import employeeRoutes from './routes/employee.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { requireHTTPS } from './middleware/httpsRedirect.js';
import fs from 'fs';
import https from 'https';
dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(xss());
app.use(mongoSanitize());
app.use(apiLimiter);
app.use(requireHTTPS);

// CORS: restrict to client origin
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: clientOrigin,
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/employee', employeeRoutes);

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  if (process.env.NODE_ENV === 'production') {
    // In production, terminate here and let nginx/ALB handle TLS and proxying
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } else {
    // Dev: optionally start HTTPS server with self-signed certs if available
    const keyPath = './certs/key.pem';
    const certPath = './certs/cert.pem';
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      https.createServer(options, app).listen(PORT, () => {
        console.log(`HTTPS Dev server listening on https://localhost:${PORT}`);
      });
    } else {
      app.listen(PORT, () => console.log(`HTTP Dev server listening on http://localhost:${PORT}`));
    }
  }
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
