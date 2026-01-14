import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ApolloProvider } from '@apollo/client';
import { ExtensionProvider } from './context/ExtensionContext';
import { P2PProvider } from './context/P2PContext';
import { apolloClient } from './api/graphql/client';
import App from './App';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const theme = createTheme({
  primaryColor: 'teal',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  defaultRadius: 'md',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ExtensionProvider>
          <P2PProvider>
            <App />
          </P2PProvider>
        </ExtensionProvider>
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>
);


