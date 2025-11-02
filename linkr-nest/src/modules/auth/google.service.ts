import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
  private oauthClient: OAuth2Client;

  constructor() {
    this.oauthClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI, // for OAuth login
    );
  }

  // Verify Google ID token (OAuth login)
  async verifyIdToken(idToken: string) {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      email: payload?.email,
      sub: payload?.sub,
      name: payload?.name,
    };
  }

  // Generate auth URL (login redirect)
  getAuthUrl(state: string) {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: scopes,
      state,
    });
  }

  // Exchange code for tokens
  async getTokens(code: string) {
    const { tokens } = await this.oauthClient.getToken(code);
    this.oauthClient.setCredentials(tokens);
    return tokens;
  }

  async getUserProfile(payload: any, accessToken: string) {
    const userInfoRes = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    const profile = await userInfoRes.json();

    console.log('profile: ', profile);

    return {
      googleId: payload.sub as string,
      email: profile.email,
      given_name: profile.given_name,
      family_name: profile.family_name,
      picture: profile.picture,
    };
  }

  // Send mail
  // async sendEmail(...) { ... }
}
