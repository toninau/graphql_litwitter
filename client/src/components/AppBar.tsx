import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { User } from '../types';

import {
  AppBar as MUIAppBar,
  createStyles,
  makeStyles,
  Toolbar,
  Theme,
  InputBase,
  fade,
  IconButton,
  Button,
  Avatar
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  AccountCircle,
} from '@material-ui/icons';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
      display: 'flex',
      alignItems: 'center',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      color: 'inherit',
      border: 'none',
      background: 'transparent',
      outline: 'none',
      cursor: 'pointer',
      display: 'flex',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    avatar: {
      backgroundColor: theme.palette.secondary.light,
      textDecoration: 'none'
    }
  })
);

const AppBar: React.FC<{ user: User | null }> = ({ user }) => {
  const classes = useStyle();
  const [input, setInput] = useState('');
  const history = useHistory();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.length > 0) {
      history.push(`/u/${input}`);
    }
  };

  return (
    <MUIAppBar position="sticky" elevation={0}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="move to home"
          edge="start"
          component={Link}
          to="/home">
          <HomeIcon />
        </IconButton>
        <form className={classes.search} onSubmit={handleSubmit}>
          <button type="submit" className={classes.searchIcon}>
            <SearchIcon />
          </button>
          <InputBase
            placeholder="Search user..."
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            value={input}
            onChange={({ target }) => setInput(target.value)}
            inputProps={{ 'aria-label': 'search' }}
          />
        </form>
        <div className={classes.grow} />
        {user ?
          <Avatar
            className={classes.avatar}
            component={Link}
            to={`/u/${user.username}`}>
            {user.username.substring(0, 1).toUpperCase()}
          </Avatar> :
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<AccountCircle />}
            component={Link}
            to={'/'}>
            login
          </Button>}
      </Toolbar >
    </MUIAppBar >
  );
};

export default AppBar;