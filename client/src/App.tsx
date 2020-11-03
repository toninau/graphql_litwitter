import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import LandingPage from './LandingPage';
import HomePage from './HomePage';
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
      </Switch>
    </>
  );
};

export default App;
