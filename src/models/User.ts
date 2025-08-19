import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  link: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    link: [{ type: Schema.Types.ObjectId, ref: 'Link', default: [] }],
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>('User', userSchema);
export default User;
