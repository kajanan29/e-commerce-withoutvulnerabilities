require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const purchasesRouter = require('./routes/purchases');

const app = express();
const PORT = process.env.PORT || 4000;

// Security middlewares
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('combined'));

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

// Routes
app.use('/api/purchases', purchasesRouter);

// simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
