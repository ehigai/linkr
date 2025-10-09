import asyncHandler from '../utils/asyncHandler';
import User from '../models/User';
import { appAssert } from '../utils/apperror';
import {
  BAD_REQUEST,
  CREATED,
  NOT_FOUND,
  OK,
} from '../constants/httpStatusCode';
import Link, { RedirectLink } from '../models/Link';
import { paramSchema, slugSchema } from '../utils/schema';
import { Types } from 'mongoose';

/////////////////////////
///// The Link document is the main link you create with a unique slug often referred to as parent link.
///// The RedirectLink document is a child to the main link, it's the link you're redirecting to under the hood.
///// One of the child links can be set to default/fallback using the toggleDefaultLink handler
/////////////////////////
// help@fairmoney.io

// Create a link
export const createLink = asyncHandler(async (req, res, next) => {
  const slug = slugSchema.parse(req.body['slug']);

  // Ensure user exists
  const user = await User.findOne({ id: req.userId }).exec();
  appAssert(user, NOT_FOUND, 'User not found');

  // Find existing slug
  const existing = await Link.findOne({ slug });
  appAssert(!existing, BAD_REQUEST, 'Slug already in use');

  const link = await Link.create({
    slug,
  });

  await User.findOneAndUpdate(
    { id: req.userId },
    { links: [...user.links, link._id] }
  );

  res
    .status(CREATED)
    .json({ data: link, message: 'Link created successfully' });
});

// Get all links
export const links = asyncHandler(async (req, res, next) => {
  // Ensure user exists
  const user = await User.findOne({ id: req.userId }).populate('links');
  appAssert(user, NOT_FOUND, 'User not found');

  const links = user.links;
  res.status(OK).json({ data: links, message: 'success' });
});

// Create a child link
export const createRedirection = asyncHandler(async (req, res, next) => {
  const redirectTo = paramSchema.parse(req.body['redirectTo']); // Link to redirect to
  const linkId = req.params['linkId']; // Custom base link

  // Ensure user exists
  const user = await User.findOne({ id: req.userId }).exec();
  appAssert(user, NOT_FOUND, 'User not found');

  // Fetch link
  const link = await Link.findOne({ id: linkId }).exec();
  appAssert(link, NOT_FOUND, 'Link not found');

  // Validate link ownership
  console.log('linkId', link._id);
  console.log('user.links', user.links);
  const isValidLink = user.links.some((l) => String(l) === String(link._id));
  appAssert(isValidLink, BAD_REQUEST, 'Invalid Link');

  // Check if any redirect is already active
  const hasActiveRedirects = await RedirectLink.exists({
    id: { $in: link.redirects },
    active: true,
  });

  // Create redirect
  const redirectLink = await RedirectLink.create({
    url: redirectTo,
    linkId: link.id,
    active: !hasActiveRedirects,
  });

  // Associate redirect with link
  link.redirects.push(redirectLink._id as Types.ObjectId);
  await link.save();

  res.status(CREATED).json({ data: link, message: 'Link added' });
});

// Delete child link
export const deleteRedirection = asyncHandler(async (req, res, next) => {
  const redirectionLinkId = paramSchema.parse(req.params['redirectionLinkId']);
  const user = await User.findOne({ id: req.userId });
  appAssert(user, NOT_FOUND, 'User not found');

  await RedirectLink.findOneAndDelete({
    id: redirectionLinkId,
  });

  res.status(OK).json({ data: null, message: 'Deleted' });
});

// Delete parent link
export const deleteLink = asyncHandler(async (req, res, next) => {
  const linkId = paramSchema.parse(req.params['linkId']);
  const user = await User.findOne({ id: req.userId });
  appAssert(user, NOT_FOUND, 'User not found');

  await Link.findOneAndDelete({ id: linkId });
  res.status(OK).json({ data: null, message: 'Deleted' });
});

export const toggleActiveLink = asyncHandler(async (req, res, next) => {
  const toggleLinkId = paramSchema.parse(req.params['toggleLinkId']); // id of the link to toggle
  const linkId = paramSchema.parse(req.params['linkId']); // id of parent link

  // Ensure user exists
  const user = await User.findOne({ id: req.userId });
  appAssert(user, NOT_FOUND, 'User not found');

  // Validate link ownership
  const isValidLink = user.links.some((l) => String(l) === String(linkId));
  appAssert(isValidLink, BAD_REQUEST, 'Invalid Link');

  // Fetch link
  const link = await Link.findOne({ id: linkId });
  appAssert(link, NOT_FOUND, 'Link not found');

  // Toggle previous active link
  const prevActive = await RedirectLink.findOneAndUpdate(
    {
      _id: { $in: link.redirects },
      active: true,
    },
    { active: false }
  );

  // Toggle new link
  const toggled = await RedirectLink.findOneAndUpdate(
    { id: toggleLinkId, _id: { $in: link.redirects } },
    { active: prevActive ? !prevActive.active : false }
  );

  res.status(OK).json({ data: toggled, message: 'Link Toggled' });
});
