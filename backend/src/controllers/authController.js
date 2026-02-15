import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { hasGoogleAuthConfig, verifyGoogleIdToken } from '../config/googleAuth.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizeSkills } from '../utils/skillNormalizer.js';
import { normalizeTextToken, uniqueArray } from '../utils/text.js';

const signToken = (userId) =>
  jwt.sign(
    {
      sub: userId
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN
    }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  resumeURL: user.resumeURL || null,
  authProvider: user.authProvider,
  googleLinked: Boolean(user.googleId),
  avatarUrl: user.avatarUrl || null,
  skills: user.skills,
  interests: user.interests,
  experienceLevel: user.experienceLevel,
  preferences: user.preferences
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, skills = [], interests = [], experienceLevel, preferences } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    if (!existingUser.password && existingUser.authProvider === 'google') {
      existingUser.name = existingUser.name || name;
      existingUser.password = password;
      existingUser.authProvider = 'local';
      existingUser.skills = normalizeSkills([...existingUser.skills, ...skills]);
      existingUser.interests = uniqueArray([...(existingUser.interests || []), ...interests].map(normalizeTextToken));
      existingUser.experienceLevel = experienceLevel || existingUser.experienceLevel;
      existingUser.preferences = { ...(existingUser.preferences?.toObject?.() || existingUser.preferences), ...(preferences || {}) };
      await existingUser.save();

      const token = signToken(existingUser._id.toString());

      res.status(201).json({
        success: true,
        token,
        user: sanitizeUser(existingUser)
      });
      return;
    }
    throw new ApiError(409, 'Email is already registered');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    authProvider: 'local',
    skills: normalizeSkills(skills),
    interests: uniqueArray(interests.map(normalizeTextToken)),
    experienceLevel: experienceLevel || 'entry',
    preferences: preferences || {},
    emailVerified: false
  });

  const token = signToken(user._id.toString());

  res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.password) {
    throw new ApiError(401, 'This account uses Google sign-in. Continue with Google instead.');
  }

  if (!(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signToken(user._id.toString());

  res.json({
    success: true,
    token,
    user: sanitizeUser(user)
  });
});

export const signInWithGoogle = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!hasGoogleAuthConfig) {
    throw new ApiError(503, 'Google sign-in is not configured on the backend');
  }

  let decodedToken;
  try {
    decodedToken = await verifyGoogleIdToken(idToken);
  } catch (error) {
    throw new ApiError(401, 'Invalid Google token');
  }

  const email = decodedToken.email?.toLowerCase()?.trim();
  if (!email) {
    throw new ApiError(400, 'Google account email is missing');
  }

  if (!decodedToken.email_verified) {
    throw new ApiError(401, 'Google account email is not verified');
  }

  const googleId = decodedToken.sub;
  const displayName = decodedToken.name || email.split('@')[0];
  const avatarUrl = decodedToken.picture || null;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: displayName,
      email,
      password: null,
      authProvider: 'google',
      googleId,
      emailVerified: true,
      avatarUrl
    });
  } else {
    user.googleId = user.googleId || googleId;
    user.avatarUrl = user.avatarUrl || avatarUrl;
    user.emailVerified = true;

    if (user.authProvider !== 'local' || !user.password) {
      user.authProvider = 'google';
      user.password = null;
    }

    await user.save();
  }

  const token = signToken(user._id.toString());

  res.json({
    success: true,
    token,
    user: sanitizeUser(user)
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const updates = req.body;
  if (updates.skills) {
    updates.skills = normalizeSkills(updates.skills);
  }

  if (updates.password) {
    delete updates.password;
  }
  if (updates.interests) {
    updates.interests = uniqueArray(updates.interests.map(normalizeTextToken));
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    user: sanitizeUser(user)
  });
});
