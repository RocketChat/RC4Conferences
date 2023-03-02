import { getCsrfToken, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import styles from '../../../styles/Signin.module.css';

const index = ({ csrf }) => {
  const router = useRouter();

  const { access_token, id_token } = JSON.parse(
    decodeURIComponent(router.asPath.split('&')[1].slice(6))
  );

  const submitTotp = async (e) => {
    e.preventDefault();
    const req = signIn('totp', {
      access_token,
      id_token,
      code: e.target.code.value,
      callbackUrl: '/',
    });
  };

  return (
    <div className={styles.totpContainer}>
      <div className={styles.totp}>
        <div className={styles.form}>
          <Form method="post" onSubmit={submitTotp}>
            <input name="csrfToken" type="hidden" defaultValue={csrf} />
            <div className={styles.inputGroup}>
              <label>Enter 2FA Code</label>
              <input name="code" type="text" className={styles.input} />
            </div>
            <Button type="submit" className={styles.submit}>
              Submit
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
