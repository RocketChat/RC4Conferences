import NextAuth from 'next-auth';
import KeyCloakProvider from 'next-auth/providers/keycloak';
import { RocketChatOAuthProvider } from '../../../lib/auth/RocketChatOAuthProvider';
import { signCook } from '../../../lib/conferences/eventCall';

export default async function handleAuth(req, res) {
  return await NextAuth({
    providers: [
      KeyCloakProvider({
        clientId: process.env.KEYCLOAK_ID,
        clientSecret: process.env.KEYCLOAK_SECRET,
        issuer: process.env.KEYCLOAK_ISSUER,
        profile(profile) {
          // profile -> returned from keycloak server.
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
        clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile, session }) {
        // Called when generating our custom token
        // Persist the OAuth access_token to the token right after signin

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
            'hashmail=' +
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
  })(req, res);
}
