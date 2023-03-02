import { useRouter } from 'next/router';
import '../styles/Layout.module.css';
import { VerifyUserRole } from './conferences/EventAdmin';
import Footer from './footer';

function Layout(props) {
  const { pathname } = useRouter();
  const disableLayout = ['/auth/signin', '/auth/signup', '/auth/[...totp.js]'];

  if (disableLayout.includes(pathname)) {
    return props.children;
  }

  return (
    <>
      <VerifyUserRole menuprops={props} />
      {props.children}
      <Footer></Footer>
    </>
  );
}

export default Layout;
