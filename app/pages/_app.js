import '/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/layout';
import SSRProvider from 'react-bootstrap/SSRProvider';
import {SessionProvider} from 'next-auth/react';
import { ApolloProvider } from '@apollo/client';
import ToastContainer from "../components/toast/ui/ToastContainer";
import { ToastProvider } from "../components/toast/context/ToastContext";
import client from '../apollo-client';

function MyApp({ Component, pageProps: {session, ...pageProps}}) {
  return (
    <SSRProvider>
      <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ToastProvider>
        <Layout menu={pageProps}>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
        </ToastProvider>
        </SessionProvider>
      </ApolloProvider>
    </SSRProvider>
  );
}

export default MyApp;
