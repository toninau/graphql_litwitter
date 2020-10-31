import React from 'react';
import { Switch, Route } from 'react-router-dom';

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
          <p>home page</p>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
