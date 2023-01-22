import { useState } from 'react';
import styles from '../styles/Oauth.module.css';
import Image from 'next/image';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { NoUserAvatar } from '../../NoUserAvatar';
import { getProviders } from 'next-auth/react';
import { useSession, signIn, signOut } from 'next-auth/react';

const OauthComponent = (props) => {
  const { user, method } = props;

  const [isLoginUiOpen, setIsLoginUiOpen] = useState(false);
  return (
    <div className={styles.authDialogWrapper}>
      <div className={styles.avatar}>
        <button className={styles.avatarButton}>
          <span
            className="d-flex align-items-center"
            onClick={() => setIsLoginUiOpen((prev) => !prev)}
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                className="rounded-circle"
                height={42}
                width={42}
              />
            ) : (
              <NoUserAvatar name={user?.name} size="42" />
            )}
          </span>
        </button>
      </div>
      {isLoginUiOpen && (
        <div className={styles.authContainer}>
          {!!user?.name ? (
            <>
              <div className="d-flex flex-column align-items-center mt-4 mb-3 ml-3 mr-3 border-bottom">
                <div className="mb-1">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      style={{
                        borderRadius: '50%',
                      }}
                      height={64}
                      width={64}
                    />
                  ) : (
                    <NoUserAvatar size="64" name={user.name} />
                  )}
                </div>
                <div className="font-weight-bold mb-1">{user.name}</div>
                <div className="mb-1" style={{ color: 'var(--bs-gray-700)' }}>
                  {user.email}
                </div>
              </div>
              <div className="d-flex justify-content-center mb-4 mt-3 ml-3 mr-3">
                <Button variant="secondary" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column align-items-center my-3">
              <Button onClick={() => signIn()}>Choose</Button>
              <Button onClick={() => signIn('github')}>Github</Button>
              <Button onClick={() => signIn('google')}>Google</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OauthComponent;
