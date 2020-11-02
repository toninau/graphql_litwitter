import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import LandingPage from './LandingPage';

import { CssBaseline } from '@material-ui/core';

const App: React.FC = () => {
  return (
    <div>
      <CssBaseline />
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/home">
          <Link to="/">back to landingpage</Link>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
