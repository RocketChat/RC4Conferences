import '../styles/Layout.module.css';
import Footer from './footer';
import Menubar from './menubar';
import { useRouter } from 'next/router';
import { VerifyUserRole } from './conferences/EventAdmin';

function Layout(props) {
  const { pathname } = useRouter();

  const disableLayout = ['/auth/signin', '/auth/signup'];

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
