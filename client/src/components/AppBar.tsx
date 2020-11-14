import React from 'react';
import { Link } from 'react-router-dom';

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
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    avatar: {
      backgroundColor: 'green',
      textDecoration: 'none'
    }
  })
);

const AppBar: React.FC<{ user: User | null }> = ({ user }) => {
  const classes = useStyle();

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
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
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