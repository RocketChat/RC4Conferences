import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styles from '../../../styles/Signin.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';

const index = ({ csrf }) => {
  const router = useRouter();

  const { access_token, id_token } = JSON.parse(
    decodeURIComponent(router.asPath.split('&')[1].slice(6))
  );

  console.log(access_token, id_token);

  const submitTotp = async (e) => {
    e.preventDefault();
    // const req = await axios.post(`/api/auth/signin/google`, {
    //   code: e.target.code.value,
    //   access_token,
    //   id_token,
    // });

    // console.log(req);
    const req = await signIn(
      'google',
      {
        callbackUrl: 'http://localhost:3000',
      },
      {
        state: encodeURIComponent(
          JSON.stringify({ access_token, id_token, code: e.target.code.value })
        ),
      }
    );

    console.log(req);
  };

  return (
    <div className={styles.totpContainer}>
      <div className={styles.signin}>
        <div className={styles.form}>
          <Form method="post" onSubmit={submitTotp}>
            <input name="csrfToken" type="hidden" defaultValue={csrf} />
            gae
            <div className={styles.inputGroup}>
              <label>2FA</label>
              <input name="code" type="text" className={styles.input} />
            </div>
            <Button type="submit" className={styles.submit}>
              Sign in
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const csrf = await getCsrfToken(context);

  return {
    props: {
      csrf,
    },
  };
}

export default index;
