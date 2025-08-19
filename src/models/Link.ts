import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuid4 } from 'uuid';

export interface RedirectDocument extends Document {
  id: string;
  url: string;
  active: boolean;
}

export interface LinkDocument extends Document {
  id: string;
  slug: string;
  redirects: string[];
}

const redirectSchema = new Schema<RedirectDocument>({
  id: { type: String, unique: true, required: true, default: uuid4 },
  url: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
});

const linkSchema = new Schema<LinkDocument>(
  {
    id: { type: String, unique: true, required: true, default: uuid4 },
    slug: { type: String, required: true, unique: true, index: true },
    redirects: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

export const RedirectLink = mongoose.model<RedirectDocument>(
  'RedirectLink',
  redirectSchema
);
const Link = mongoose.model<LinkDocument>('Link', linkSchema);

export default Link;
