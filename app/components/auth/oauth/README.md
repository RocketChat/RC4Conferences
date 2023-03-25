# How to setup auth for the OAuth component
Please add both `NEXTAUTH_URL` and `NEXTAUTH_SECRET` this is required to work with next-auth package which we rely on for authentication purposes. `NEXTAUTH_SECRET` is used for encrypting JWT tokens, you can enter anything there, but a secure encryption token is always a better choice.

```
inside app/.env.local

NEXTAUTH_URL=<this is the URL where the rc4conferences app is running>
NEXTAUTH_SECRET=<you can enter anything here>
```


## Setup google oauth

head over to https://console.developers.google.com/ > credentials > create credentials > oauth client id
create an application, and then 

Authorized JavaScript origins - (URL where the rc4conferences app is running)
eg: http://localhost:3002

Authorized redirect URIs - (the same URL as used above with /api/auth/callback/google)
eg: http://localhost:3002/api/auth/callback/google

and then 

```
inside app/.env.local

NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your google client id goes here>
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=<your secret goes here>
```
## Setup github oauth

head over to https://github.com/settings/apps > oauth apps > create a new app

Homepage URL - (URL where the rc4conferences app is running)
eg: http://localhost:3002

Authorization callback URL - (the same URL as used above with /api/auth/callback/google)
eg: http://localhost:3002/api/auth/callback/github

and then 

```
inside app/.env.local

NEXT_PUBLIC_GITHUB_ID=<your github client id goes here>
NEXT_PUBLIC_GITHUB_SECRET=<your secret goes here>
```

## Setup auth through credentials

if you intend on using TOTP then you must configure this

head over to administration > settings > email > smtp

setup email configuration

