import '../styles/Layout.module.css';
import Footer from './footer';
import { useRouter, Router } from 'next/router';
import { VerifyUserRole } from './conferences/EventAdmin';
import { useState } from 'react';
import Link from 'next/link';

function Layout(props) {
  const [loading, setLoading] = useState(false);

  Router.events.on('routeChangeStart', () => setLoading(true));
  Router.events.on('routeChangeComplete', () => setLoading(false));

  return (
    <>
      <div className="announcement_strip">
        <a
          href={'/conferences/c/GSoC-Alumni-Summit-2024'}
          style={{ textDecoration: 'none', color: 'white' }}
        >
          <h6>
            📢 Join our GSoC'24 Alumni Summit at{' '}
            {new Date('2024-03-25T11:00:00.000Z').toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short',
            })}
          </h6>
        </a>
      </div>
      <VerifyUserRole menuprops={props} />
      {props.children}
      <Footer></Footer>
      {loading && <span className="loader"></span>}
    </>
  );
}

export default Layout;
