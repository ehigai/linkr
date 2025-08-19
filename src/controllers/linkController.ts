import asyncHandler from '../utils/asyncHandler';
import mongoose from 'mongoose';
import User from '../models/User';
import { appAssert } from '../utils/apperror';
import {
  BAD_REQUEST,
  CREATED,
  NOT_FOUND,
  OK,
} from '../constants/httpStatusCode';
import Link, { RedirectLink } from '../models/Link';
import { slugSchema } from '../utils/schema';

export const createLink = asyncHandler(async (req, res, next) => {
  const slug = slugSchema.parse(req.body['slug']);

  // Ensure user exists
  const user = await User.findOne({ id: req.userId });
  appAssert(user, NOT_FOUND, 'User not found');

  // Find existing slug
  const existing = await Link.findOne({ slug });
  appAssert(!existing, BAD_REQUEST, 'Slug already in use');

  const link = await Link.create({
    slug,
  });

  user.links.push(link.id);
  await user.save();

  res
    .status(CREATED)
    .json({ data: link, message: 'Link created successfully' });
});

export const links = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ id: req.userId }).populate('links');

  // Ensure user exists
  appAssert(user, NOT_FOUND, 'User not found');

  const links = user.links;
  res.status(OK).json({ data: links });
});

// Add a link to be redirected to
export const createRedirection = asyncHandler(async (req, res, next) => {
  const { redirectTo } = req.body; // Link to redirect to
  const linkId = req.params['linkId']; // Custom base link

  // Ensure user exists
  const user = await User.findOne({ id: req.userId }).exec();
  appAssert(user, NOT_FOUND, 'User not found');

  // Validate link ownership
  const isValidLink = user.links.some((l) => String(l) === String(linkId));
  appAssert(isValidLink, BAD_REQUEST, 'Invalid Link');

  // Fetch link
  const link = await Link.findOne({ id: linkId }).exec();
  appAssert(link, NOT_FOUND, 'Link not found');

  // Check if any redirect is already active
  const hasActiveRedirects = await RedirectLink.exists({
    id: { $in: link.redirects },
    active: true,
  });

  // Create redirect
  const redirectLink = await RedirectLink.create({
    url: redirectTo,
    active: !hasActiveRedirects,
  });

  // Associate redirect with link
  link.redirects.push(redirectLink.id);
  await link.save();

  res.status(CREATED).json({ data: link, message: 'Link added' });
});
