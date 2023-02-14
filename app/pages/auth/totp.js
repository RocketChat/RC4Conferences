import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styles from '../../styles/Signin.module.css';
import axios from 'axios';

const index = ({ csrf }) => {
  const submitTotp = async (e) => {
    e.preventDefault();
    const req = await axios.post('/api/auth/totp?code', {
      code: e.target.code.value,
    });

    console.log(req);
  };

  return (
    <div className={styles.totpContainer}>
      <div className={styles.signin}>
        <div className={styles.form}>
          <Form method="post" onSubmit={submitTotp}>
            <input name="csrfToken" type="hidden" defaultValue={csrf} />

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
