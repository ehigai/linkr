import mongoose, { mongo } from 'mongoose';
import { DATABASE_URL, NODE_ENV, TEST_DATABASE_URL } from '../constants/env';

const URL = NODE_ENV === 'development' ? TEST_DATABASE_URL : DATABASE_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
  } catch (error) {
    throw new Error('DATABASE: connection error');
  }
};

export default connectDB;
