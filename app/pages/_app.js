import '/styles/vars.css';
import '/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/layout';
import { Toaster } from 'react-hot-toast';
function MyApp({ Component, pageProps }) {
  return (
    <Layout menu={pageProps}>
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
