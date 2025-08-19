import mongoose, { Schema, Document, Types } from 'mongoose';
import { v4 as uuid4 } from 'uuid';

export interface SessionDocument extends Document {
  id: string;
  userId: string;
  expiresAt: Date;
  userAgent: string;
}

const sessionModel = new Schema<SessionDocument>(
  {
    id: { type: String, unique: true, required: true, default: uuid4 },
    userAgent: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Session = mongoose.model<SessionDocument>('Session', sessionModel);
export default Session;
