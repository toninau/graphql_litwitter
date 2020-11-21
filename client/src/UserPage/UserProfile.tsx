import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { User } from '../types';
import { UPDATE_USER } from '../queries/userQueries';
import UserModal from './UserModal';

import {
  Button,
  Box,
  Typography,
  createStyles,
  makeStyles,
  Theme,
  IconButton,
  Tooltip,
  Grid,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Today as TodayIcon, ExitToApp } from '@material-ui/icons';

interface ProfileProps {
  user: User | undefined;
  owner: boolean;
  logout: () => void;
  token: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        marginRight: theme.spacing(1),
      },
    },
    todayIcon: {
      marginRight: theme.spacing(1),
      color: theme.palette.text.secondary
    }
  }),
);

const UserProfile: React.FC<ProfileProps> = ({ user, owner, logout, token }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [updateUser] = useMutation<{ updateUser: User }>(UPDATE_USER);

  const dateString = new Intl
    .DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
    .format(Date.parse(user?.createdAt || '0'));

  const handleOpen = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleSubmit = async (name: string, description: string) => {
    try {
      await updateUser({
        context: {
          headers: {
            authorization: `bearer ${token}`
          },
        },
        variables: {
          name,
          description
        }
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    return (
      <Box padding={2}>
        <Grid style={{ paddingBottom: '8px' }} container alignItems="baseline">
          <Grid item xs>
            <Typography noWrap variant="h6">
              {user.name}
            </Typography>
            <Typography noWrap variant="body2" color="textSecondary">
              @{user.username}
            </Typography>
          </Grid>
          <Grid item>
            <Box className={classes.root} display="flex" flexDirection="row" alignItems="center">
              {owner ?
                <>
                  <Button
                    onClick={handleOpen}
                    variant="outlined"
                    color="primary">
                    edit profile
                  </Button>
                  <UserModal
                    open={open}
                    handleOpen={handleOpen}
                    user={user}
                    handleSubmit={handleSubmit}
                  />
                  <Tooltip title="Logout" aria-label="logout">
                    <IconButton onClick={logout} color="primary">
                      <ExitToApp />
                    </IconButton>
                  </Tooltip>
                </> :
                <Button variant="contained" color="primary">
                  follow
                </Button>
              }
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" style={{ overflowWrap: 'break-word' }}>
          {user.description}
        </Typography>
        <Box display="flex" alignItems="center" paddingTop={1}>
          <TodayIcon className={classes.todayIcon} />
          <Typography variant="body2" color="textSecondary">
            joined {dateString}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box padding={2}>
      <Typography noWrap variant="h6">
        <Skeleton width={100} />
      </Typography>
      <Typography noWrap variant="body2">
        <Skeleton width={50} />
      </Typography>
      <Typography variant="body2">
        <Skeleton width={350} />
      </Typography>
      <Box display="flex" alignItems="center" paddingTop={1}>
        <Skeleton width={24} height={24} className={classes.todayIcon} />
        <Typography variant="body2">
          <Skeleton width={100} />
        </Typography>
      </Box>
    </Box>
  );
};

export default UserProfile;