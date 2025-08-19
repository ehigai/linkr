import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuid4 } from 'uuid';

export interface Redirect {
  id: string;
  url: string;
  active: boolean;
}

export interface LinkDocument extends Document {
  slug: string;
  redirects: Redirect[];
}

const redirectSchema = new Schema<Redirect>(
  {
    id: { type: String, unique: true, required: true, default: uuid4 },
    url: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  { _id: false } // avoids creating _id for each redirect
);

const linkSchema = new Schema<LinkDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    redirects: { type: [redirectSchema], default: [] }, // typed array
  },
  { timestamps: true }
);

const Link: Model<LinkDocument> = mongoose.model<LinkDocument>(
  'Link',
  linkSchema
);

export default Link;
