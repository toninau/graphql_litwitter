import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import LandingPage from './LandingPage';
import HomePage from './HomePage';
import UserPage from './UserPage';
import { useStateValue } from './state';

import { CssBaseline } from '@material-ui/core';

const App: React.FC = () => {
  const [token] = useStateValue();

  return (
    <>
      <CssBaseline />
      <Switch>
        <Route exact path="/">
          {!token ? <LandingPage /> : <Redirect to="home" />}
        </Route>
        <Route path="/home">
          <HomePage />
        </Route>
        <Route path="/u/:username">
          <UserPage />
        </Route>
        <Route path="*">
          <p>page not found</p>
        </Route>
      </Switch>
    </>
  );
};

export default App;
