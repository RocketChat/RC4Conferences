import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import KeyCloakProvider from 'next-auth/providers/keycloak';
import { RocketChatOAuthProvider } from '../../../lib/auth/RocketChatOAuthProvider';
import { signCook } from '../../../lib/conferences/eventCall';

const createOptions = (req, res) => ({
  providers: [
    CredentialsProvider({
      id: 'totp',
      name: 'totp',
      credentials: {
        access_token: {
          label: 'Access token',
          type: 'text',
          placeholder: 'jsmith',
        },
        id_token: { label: 'Id token', type: 'password' },
        code: { label: '2FA', type: 'number', placeholder: '123456' },
      },

      async authorize(credentials, req) {
        let user;
        const { access_token, id_token, code } = credentials;

        const request = await fetch(
          `${process.env.NEXT_PUBLIC_RC_URL}/api/v1/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serviceName: 'google',
              accessToken: access_token,
              idToken: id_token,
              expiresIn: 3600,
              totp: {
                code,
              },
            }),
          }
        );
        const response = await request.json();

        if (response?.status === 'success') {
          const { data } = response;
          const { userId, authToken, me } = data;
          const { name, username, emails } = me;
          const email = emails[0].address;
          const cook = await signCook(userId, authToken);
          user = {
            id: userId,
            name,
            email,
            username,
            cook,
          };
          return user;
        } else {
          throw new Error('2fa-error');
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
        code: { label: '2FA', type: 'numbers' },
      },
      async authorize(credentials, req) {
        console.log(credentials);
        let user;
        const { username, password, code } = credentials;
        console.log(credentials);
        const request = await fetch(
          `${process.env.NEXT_PUBLIC_RC_URL}/api/v1/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: username,
              password,
              code,
            }),
          }
        );
        const response = await request.json();

        if (response?.status === 'success') {
          const { data } = response;
          const { userId, authToken, me } = data;
          const { name, username, emails } = me;
          const email = emails[0].address;
          const cook = await signCook(userId, authToken);
          user = {
            id: userId,
            name,
            email,
            username,
            cook,
          };
          return user;
        } else {
          throw new Error('totp-required');
        }
      },
    }),
    KeyCloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    RocketChatOAuthProvider({
      clientId: process.env.ROCKETCHAT_CLIENT_ID,
      clientSecret: process.env.ROCKETCHAT_CLIENT_SECRET,
      rocketChatUrl: process.env.ROCKETCHAT_URL,
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account, profile, session }) {
      const { provider, access_token, id_token } = account || {};
      if (provider === 'google') {
        try {
          const login = await fetch(
            `${process.env.NEXT_PUBLIC_RC_URL}/api/v1/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                serviceName: 'google',
                accessToken: access_token,
                idToken: id_token,
                expiresIn: 3600,
              }),
            }
          );

          const response = await login.json();
          if (response.status === 'success') {
            const { data } = response;
            console.log(data);
            res.setHeader('Set-Cookie', [
              `rc_token=${response.data.authToken}; path=/`,
              `rc_id=${response.data.userId}; path=/`,
            ]);
          }

          if (response.error == 'totp-required') {
            const state = encodeURIComponent(
              JSON.stringify({
                access_token,
                id_token,
              })
            );
            res.redirect(`/auth/totp&state=${state}`);
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }

      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.sub = token.sub;
      session.user.image = token.picture;

      if (session.user?.email) {
        const hashmail = await signCook({ mail: session.user.email });
        const expTime = new Date(session.expires).toUTCString();
        res.setHeader('Set-Cookie', [
          'hashmeth=' +
            hashmail.data.hash +
            '; expires=' +
            expTime +
            '; path=/',
        ]);
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      res.setHeader('Set-Cookie', [
        'hashmail=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'rc_uid=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'rc_token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
      ]);
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export default async function handleAuth(req, res) {
  return await NextAuth(req, res, createOptions(req, res));
}
