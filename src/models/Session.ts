import mongoose, { Schema, Document, Types } from 'mongoose';
import { truncate } from 'node:fs';

export interface SessionDocument extends Document {
  userId: Types.ObjectId;
  expiresAt: Date;
  userAgent: string;
}

const sessionModel = new Schema<SessionDocument>(
  {
    userAgent: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Session = mongoose.model<SessionDocument>('Session', sessionModel);
export default Session;
