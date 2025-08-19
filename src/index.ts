import 'dotenv/config.js';
import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/authRoute';
import { PORT } from './constants/env';
import errorHandler from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
import connectDB from './db';
import cors from 'cors';
import linkRouter from './routes/linkRoute';
import { authenticate } from './middleware/authenticate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/v1', (req, res, next) => {
  res.json({
    message: 'ACTIVE',
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', authenticate, linkRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`[SERVER]: listening on http://localhost:${PORT}`);
});
