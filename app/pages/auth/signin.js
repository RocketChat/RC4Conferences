import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn({ csrfToken }) {
  const [totpRequired, setTotpRequired] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const req = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const res = await req.json();
      console.log('resss', res);

      if (res?.error === 'totp-required') {
        setCredentials({ username, password });
        setTotpRequired(true);
        console.log(res.error);
      } else {
        setCredentials({ username, password });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const code = e.target.code.value;
    const res = await signIn('credentials', {
      username,
      password,
      code,
      callbackUrl: '/',
    });
    console.log(res);

    if (res?.error) {
      console.log(res.error);
    }
  };

  return (
    <form method="post" onSubmit={totpRequired ? handleLogin : handleVerify}>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Username
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      {totpRequired && (
        <label>
          2FA
          <input name="code" type="text" />
        </label>
      )}
      <button type="submit">Sign in</button>
    </form>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
