import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { LOGIN_USER } from '../queries/userQueries';
import AccountForm from './AccountForm';
import { AccountValues } from '../types';
import { useStateValue } from '../state';
import storage from '../storage';

import './landingPage.css';

import {
  Box,
  Grid,
  Link,
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
      <div className="landing-page__section landing-page__section--white">
        <Box
          display="flex"
          flexDirection="column"
          width="300px">
          <Box paddingBottom={2}>
            <AccountForm
              handleSubmit={logIn ? handleLogIn : handleSignUp}
              text={logIn ? 'Log In' : 'Sign Up'}
              loading={!!loading}
            />
          </Box>
          <Grid container>
            <Grid item xs>
              <Link component="button" variant="body2" onClick={() => setLogIn(prevLogIn => !prevLogIn)}>
                {!logIn ? 'Log In' : 'Sign Up'}
              </Link>
            </Grid>
            <Grid item>
              <Link variant="body2" component={RouterLink} to="/home">
                Home page
              </Link>
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