import React, { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { UserWithExtra, User, Follower, FollowsTo } from '../types';
import { UPDATE_USER } from '../queries/userQueries';
import { FOLLOWERS, FOLLOWS_TO } from '../queries/followQueries';

import UserModal from './UserModal';
import FollowModal from './FollowModal';

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
  Link
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Today as TodayIcon, ExitToApp } from '@material-ui/icons';

interface ProfileProps {
  user: UserWithExtra | undefined;
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
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [openFollowsToModal, setOpenFollowsToModal] = useState(false);
  const [updateUser] = useMutation<{ updateUser: User }>(UPDATE_USER);
  const [getFollowers, { loading, data }] = useLazyQuery<{ followers: Follower[] }>(FOLLOWERS);
  const [getFollowing, { loading: loading2, data: data2 }] = useLazyQuery<{ followsTo: FollowsTo[] }>(FOLLOWS_TO);

  const dateString = new Intl
    .DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
    .format(Date.parse(user?.createdAt || '0'));

  const handleOpenUserModal = () => {
    setOpenUserModal(prevOpen => !prevOpen);
  };

  const handleOpenFollowModal = (followType?: string) => {
    if (followType === 'followers') {
      setOpenFollowerModal(true);
      getFollowers({ variables: { id: user?.id } });
    } else {
      setOpenFollowsToModal(true);
      getFollowing({ variables: { id: user?.id } });
    }
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
                    onClick={handleOpenUserModal}
                    variant="outlined"
                    color="primary">
                    edit profile
                  </Button>
                  <UserModal
                    open={openUserModal}
                    handleOpen={handleOpenUserModal}
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
                  {user.following ? 'unfollow' : 'follow'}
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
        <Box display="flex" alignItems="center" paddingTop={1}>
          <Link onClick={() => handleOpenFollowModal('followers')} color="textPrimary" style={{ cursor: 'pointer' }}>
            <Box paddingRight={1}>
              <Typography variant="body1" color="textPrimary">
                {user.followersCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                followers
              </Typography>
            </Box>
          </Link>
          <Link onClick={() => handleOpenFollowModal()} color="textPrimary" style={{ cursor: 'pointer' }}>
            <Box paddingLeft={1}>
              <Typography variant="body1" color="textPrimary">
                {user.followsCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                following
              </Typography>
            </Box>
          </Link>
        </Box>
        <FollowModal
          open={openFollowerModal}
          handleClose={() => setOpenFollowerModal(false)}
          loading={loading}
          followers={data?.followers}
          text="Followers"
        />
        <FollowModal
          open={openFollowsToModal}
          handleClose={() => setOpenFollowsToModal(false)}
          loading={loading2}
          following={data2?.followsTo}
          text="Following"
        />
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