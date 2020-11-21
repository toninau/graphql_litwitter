import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { LOGIN_USER, SIGNUP_USER } from '../queries/userQueries';
import AccountForm from './AccountForm';
import { AccountValues } from '../types';
import { useStateValue } from '../state';
import storage from '../storage';

import './landingPage.css';

import {
  Avatar,
  Box,
  createStyles,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import {
  Search,
  PeopleAlt,
  AccessTime,
  Lock as LockIcon
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';


type FieldError = {
  field: string;
  message: string;
};

interface Data {
  errors: FieldError[] | null;
  value?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      '& span, & svg': {
        color: 'white',
        fontSize: '1.5rem'
      }
    },
    avatar: {
      backgroundColor: theme.palette.primary.main
    },
    alert: {
      marginBottom: theme.spacing(3)
    }
  }),
);

const LandingPage: React.FC = () => {
  const [loginUser, { loading: loginLoading }] = useMutation<{ login: Data }>(LOGIN_USER);
  const [signupUser, { loading: signupLoading }] = useMutation<{ register: Data }>(SIGNUP_USER);
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

  const handleSignUp = async (values: AccountValues) => {
    try {
      const { data } = await signupUser({
        variables: {
          ...values
        }
      });
      if (data?.register.errors) {
        setErrors(data.register.errors);
      } else if (data?.register.value) {
        storage.saveToken(data.register.value);
        setToken(data.register.value);
        history.push('/home');
      }
    } catch (error) {
      setErrors([{ field: 'none', message: 'something unexpected happened' }]);
    }
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
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              paddingBottom={3}>
              <Avatar className={classes.avatar}>
                <LockIcon />
              </Avatar>
              <Typography align="center" variant="h4">
                {logIn ? 'Log In' : 'Sign Up'}
              </Typography>
            </Box>
            {errors &&
              <Alert className={classes.alert} severity="error" onClose={() => setErrors(null)}>
                <AlertTitle>{errors[0].field}</AlertTitle>
                {errors[0].message}
              </Alert>
            }
            <AccountForm
              handleSubmit={logIn ? handleLogIn : handleSignUp}
              loading={loginLoading || signupLoading}
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
      </div>
    </div >
  );
};

export default LandingPage;