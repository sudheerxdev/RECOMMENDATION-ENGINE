import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';

const hasGoogleAuthConfig = Boolean(env.GOOGLE_CLIENT_ID);
const googleClient = hasGoogleAuthConfig ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

export const verifyGoogleIdToken = async (idToken) => {
  if (!googleClient || !env.GOOGLE_CLIENT_ID) {
    throw new Error('Google auth is not configured');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID
  });

  return ticket.getPayload();
};

export { hasGoogleAuthConfig };
