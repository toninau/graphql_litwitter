import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';

import App from './App';
import { StateProvider } from './state';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[600]
    },
    secondary: {
      main: red[500]
    }
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '100vh'
      }
    }
  }
});

ReactDOM.render(
  <Router>
    <ApolloProvider client={client}>
      <StateProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StateProvider>
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
);
