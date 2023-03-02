import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styles from '../../styles/Signin.module.css';

export default function SignIn({ csrfToken }) {
  const [totpRequired, setTotpRequired] = useState(false);

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

      if (res?.error === 'totp-required') {
        setTotpRequired(true);
      } else {
        await signIn('credentials', {
          username,
          password,
          callbackUrl: '/',
        });
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
    const payload = totpRequired
      ? { username, password, code, callbackUrl: '/' }
      : { username, password, callbackUrl: '/' };

    const res = await signIn('credentials', payload);

    if (res?.error) {
      console.log(res.error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signin}>
        <div className={styles.authOptions}>
          <Button
            className={styles.authOption}
            onClick={() =>
              signIn('google', {
                callbackUrl: '/',
              })
            }
          >
            Sign in with google
          </Button>
          <Button
            className={styles.authOption}
            onClick={() =>
              signIn('github', {
                callbackUrl: '/',
              })
            }
          >
            Sign in with github
          </Button>
        </div>
        OR
        <div className={styles.form}>
          <Form
            method="post"
            onSubmit={totpRequired ? handleLogin : handleVerify}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Form.Group className={styles.inputGroup}>
              <label>Username</label>
              <Form.Control
                name="username"
                type="text"
                className={styles.input}
              />
            </Form.Group>
            <Form.Group className={styles.inputGroup}>
              <label>Password</label>
              <Form.Control
                name="password"
                type="password"
                className={styles.input}
              />
            </Form.Group>
            {totpRequired && (
              <div className={styles.inputGroup}>
                <label>2FA</label>
                <input name="code" type="text" className={styles.input} />
              </div>
            )}
            <Button type="submit" className={styles.submit}>
              Sign in
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
