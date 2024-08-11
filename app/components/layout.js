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
      <VerifyUserRole menuprops={props} />
      {props.children}
      <Footer></Footer>
      {loading && <span className="loader"></span>}
    </>
  );
}

export default Layout;
