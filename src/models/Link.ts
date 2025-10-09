import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { v4 as uuid4 } from 'uuid';

export interface RedirectDocument extends Document {
  id: string;
  url: string;
  linkId: string;
  active: boolean;
}

export interface LinkDocument extends Document {
  id: string;
  slug: string;
  redirects: Types.ObjectId[];
}

const redirectSchema = new Schema<RedirectDocument>({
  id: { type: String, unique: true, required: true, default: uuid4 },
  url: { type: String, required: true },
  linkId: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
});

const linkSchema = new Schema<LinkDocument>(
  {
    id: { type: String, unique: true, required: true, default: uuid4 },
    slug: { type: String, required: true, unique: true, index: true },
    redirects: [{ type: Schema.Types.ObjectId, ref: 'Redirect', default: [] }],
  },
  { timestamps: true }
);

// Remove from Link array if redirectLink Is deleted
redirectSchema.pre('findOneAndDelete', async function (next) {
  const redirect = await this.model.findOne(this.getFilter());
  if (redirect) {
    await mongoose
      .model('Link')
      .updateOne(
        { id: redirect.linkId },
        { $pull: { redirects: redirect._id } }
      );
  }

  next();
});

// Delete all associated redirectLinks when link is deleted
linkSchema.pre('findOneAndDelete', async function (next) {
  const link = await this.model.findOne(this.getFilter());
  if (link) {
    await mongoose.model('RedirectLink').deleteMany({ linkId: link.id });
  }
  next();
});

export const RedirectLink = mongoose.model<RedirectDocument>(
  'RedirectLink',
  redirectSchema
);
const Link = mongoose.model<LinkDocument>('Link', linkSchema);

export default Link;
