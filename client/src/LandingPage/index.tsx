import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import AccountForm from './AccountForm';
import { AccountValues } from '../types';
import './landingPage.css';

import {
  Box,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Search, PeopleAlt, AccessTime } from '@material-ui/icons';

const useStyles = makeStyles({
  item: {
    '& span, & svg': {
      color: 'white',
      fontSize: '1.5rem'
    }
  }
});

const LandingPage: React.FC = () => {
  const [logIn, setLogIn] = useState(true);
  const classes = useStyles();

  const landingList = [
    {
      text: 'Chat',
      icon: <Search />
    },
    {
      text: 'Follow',
      icon: <PeopleAlt />
    },
    {
      text: 'Other stuff',
      icon: <AccessTime />
    }
  ];

  const handleSignUp = (values: AccountValues): void => {
    console.log(values);
  };

  const handleLogIn = (values: AccountValues): void => {
    console.log(values);
  };

  return (
    <div className="landing-page__container">
      <div className="landing-page__section landing-page__section--background">
        <List>
          {landingList.map(item => (
            <ListItem className={classes.item} key={item.text}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
      <div className="landing-page__section">
        <Box
          display="flex"
          flexDirection="column"
          width="300px">
          <Box paddingBottom={2}>
            <AccountForm
              handleSubmit={logIn ? handleLogIn : handleSignUp}
              text={logIn ? 'Log in to your account' : 'Create a new account'}
            />
          </Box>
          <Grid
            style={{ textAlign: 'center' }}
            container
            alignItems="center">
            <Grid item xs>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setLogIn(prevLogIn => !prevLogIn)}>
                {!logIn ? 'Log In' : 'Sign Up'}
              </Button>
            </Grid>
            <Divider flexItem orientation="vertical" />
            <Grid item xs>
              <Button component={RouterLink} to="/home">
                go to main page
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div >
  );
};

export default LandingPage;