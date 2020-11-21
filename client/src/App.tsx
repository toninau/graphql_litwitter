import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useLocation, useRouteMatch } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import LandingPage from './LandingPage';
import HomePage from './HomePage';
import UserPage from './UserPage';
import AppBar from './components/AppBar';

import storage from './storage';
import { useStateValue } from './state';
import { User } from './types';
import { ME_USER } from './queries/userQueries';

import { CssBaseline, Toolbar } from '@material-ui/core';

const App: React.FC = () => {
  const client = useApolloClient();
  const [token, setToken] = useStateValue();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log('fetch user from app');
      try {
        const { data } = await client.query<{ me: User }>({
          query: ME_USER,
          context: {
            headers: {
              authorization: `bearer ${token}`
            }
          },
          fetchPolicy: 'no-cache'
        });
        setUser(data.me);
      } catch (error) {
        // token invalid
        storage.removeToken();
        setToken('');
      }
    };
    if (token) {
      void fetchUser();
    } else if (user) {
      // token changes, but user already exists in user state = logout
      setUser(null);
    }
  }, [token]);

  const match = useRouteMatch<{ username: string }>('/u/:username');

  return (
    <>
      <ScrollToTop />
      <CssBaseline />
      <AppBar user={user} />
      <Toolbar />
      <Switch>
        <Route exact path="/">
          {!token ? <LandingPage /> : <Redirect to="/home" />}
        </Route>
        <Route path="/home">
          <HomePage user={user} />
        </Route>
        <Route path="/u/:username">
          <UserPage user={user} username={match?.params.username} />
        </Route>
        <Route path="*">
          <p>page not found</p>
        </Route>
      </Switch>
    </>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default App;
