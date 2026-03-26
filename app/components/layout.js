import '../styles/Layout.module.css';
import Footer from './footer';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import SiteNavbar from './site-navbar';

function Layout(props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  return (
    <>
      <SiteNavbar />
      {props.children}
      <Footer></Footer>
      {loading && <span className="loader"></span>}
    </>
  );
}

export default Layout;
