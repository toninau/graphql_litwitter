import React from 'react';
import { User } from '../types';

import {
  Button,
  Box,
  Typography,
  createStyles,
  makeStyles,
  Theme,
  Paper
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

interface ProfileProps {
  user: User | undefined;
  owner: boolean;
  logout: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const UserProfile: React.FC<ProfileProps> = ({ user, owner, logout }) => {
  const classes = useStyles();

  if (user) {
    return (
      <Paper variant="outlined" square>
        <Box display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="baseline"
          padding={2}>
          <div>
            <Typography variant="h5">
              {user.username}
            </Typography>
            <Typography variant="body1">
              {user.description}
            </Typography>
          </div>
          <Box className={classes.root} display="flex" flexDirection="row">
            {owner ?
              <>
                <Button variant="contained" color="primary">update</Button>
                <Button variant="contained" onClick={logout} color="primary">
                  logout
                </Button>
              </> :
              <Button variant="contained" color="primary">
                follow
              </Button>
            }
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <div>
      <Skeleton variant="rect" width={210} height={210} />
    </div>
  );
};

export default UserProfile;