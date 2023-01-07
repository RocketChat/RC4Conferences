import '/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/layout';
import SSRProvider from 'react-bootstrap/SSRProvider';
import {SessionProvider} from 'next-auth/react';
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import ErrorBoundary from './error';

function MyApp({ Component, pageProps: {session, ...pageProps}}) {
  return (
    <SSRProvider>
      <ErrorBoundary>
      <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <Layout menu={pageProps}>
          <Component {...pageProps} />
        </Layout>
        </SessionProvider>
      </ApolloProvider>
      </ErrorBoundary>
    </SSRProvider>
  );
}

export default MyApp;
