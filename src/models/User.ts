import mongoose, { Schema, Document, Types } from 'mongoose';
import { v4 as uuid4 } from 'uuid';

export interface UserDocument extends Document {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  links: Types.ObjectId[];
}

const userSchema = new Schema<UserDocument>(
  {
    id: { type: String, unique: true, required: true, default: uuid4 },
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    links: [{ type: Schema.Types.ObjectId, default: [], ref: 'Link' }],
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>('User', userSchema);
export default User;
