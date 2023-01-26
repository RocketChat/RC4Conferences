import NextAuth from 'next-auth';
import KeyCloakProvider from 'next-auth/providers/keycloak';
import { RocketChatOAuthProvider } from '../../../lib/auth/RocketChatOAuthProvider';
import { signCook } from '../../../lib/conferences/eventCall';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Cookies from 'js-cookie';
import CredentialsProvider from 'next-auth/providers/credentials';

export default async function handleAuth(req, res) {
  return await NextAuth({
    providers: [
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: 'Credentials',
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied

          console.log('this is cred', credentials);
          console.log('this is req', req);

          const user = {
            id: '1',
            name: 'J Smith',
            email: 'jsmith@example.com',
          };

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        },
      }),
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
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile, session }) {
        // Called when generating our custom token
        // Persist the OAuth access_token to the token right after signin
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
            console.log('this is ress', response);
            if (response.status === 'success') {
              res.setHeader('Set-Cookie', [
                `rc_token=${response.data.authToken}; path=/`,
                `rc_id=${response.data.userId}; path=/`,
              ]);
              if (!response.data.me.username) {
                // await this.updateUserUsername(
                //   response.data.userId,
                //   response.data.me.name
                // );
              }
              console.log('lmaooooo', Cookies.get('rc_token'));
              console.log(
                'laskjdflksadjfkl',
                req.headers.cookie,
                req.cookies['rc_token'],
                req.cookies['rc_id']
              );

              // return { status: response.status, me: response.data.me };
            }

            if (response.error == 'totp-required') {
            }
          } catch (error) {
            console.log(error.message);
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
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
  })(req, res);
}
