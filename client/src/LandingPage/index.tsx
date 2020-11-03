import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { LOGIN_USER } from '../_queries/userQueries';
import AccountForm from './AccountForm';
import { AccountValues } from '../types';
import { useStateValue } from '../state';
import storage from '../storage';

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

type FieldError = {
  field: string;
  message: string;
};

interface LoginData {
  login: {
    errors: FieldError[] | null;
    value?: string;
  };
}

const useStyles = makeStyles({
  item: {
    '& span, & svg': {
      color: 'white',
      fontSize: '1.5rem'
    }
  }
});

const LandingPage: React.FC = () => {
  const [loginUser, { loading }] = useMutation<LoginData>(LOGIN_USER);
  const [logIn, setLogIn] = useState(true);
  const [errors, setErrors] = useState<FieldError[] | null>(null);
  const [, setToken] = useStateValue();
  const history = useHistory();
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

  const handleLogIn = async (values: AccountValues) => {
    try {
      const { data } = await loginUser({
        variables: {
          ...values
        }
      });
      if (data?.login.errors) {
        setErrors(data.login.errors);
      } else if (data?.login.value) {
        storage.saveToken(data.login.value);
        setToken(data.login.value);
        history.push('/home');
      }
    } catch (error) {
      setErrors([{ field: 'none', message: 'something unexpected happened' }]);
    }
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
              loading={!!loading}
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
                home page
              </Button>
            </Grid>
          </Grid>
        </Box>
        {errors &&
          <p>{errors[0].message}</p>
        }
      </div>
    </div >
  );
};

export default LandingPage;