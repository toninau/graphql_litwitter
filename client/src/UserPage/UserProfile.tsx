import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { UserWithExtra, User, Follower, FollowsTo } from '../types';
import { UPDATE_USER } from '../queries/userQueries';
import { FOLLOWERS, FOLLOWS_TO, FOLLOW, UNFOLLOW } from '../queries/followQueries';

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
import { Today as TodayIcon, ExitToApp } from '@material-ui/icons';

interface ProfileProps {
  user: UserWithExtra;
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
  const history = useHistory();
  const [stateUser, setStateUser] = useState<UserWithExtra>(user);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [openFollowsToModal, setOpenFollowsToModal] = useState(false);
  const [updateUser] = useMutation<{ updateUser: User }>(UPDATE_USER);
  const [followUser] = useMutation(FOLLOW);
  const [unfollowUser] = useMutation(UNFOLLOW);
  const [getFollowers, { loading, data }] = useLazyQuery<{ followers: Follower[] }>(FOLLOWERS, {
    fetchPolicy: 'no-cache'
  });
  const [getFollowing, { loading: loading2, data: data2 }] = useLazyQuery<{ followsTo: FollowsTo[] }>(FOLLOWS_TO, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    setStateUser(user);
  }, [user]);

  const dateString = new Intl
    .DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
    .format(Date.parse(stateUser.createdAt));

  const handleOpenUserModal = () => {
    setOpenUserModal(prevOpen => !prevOpen);
  };

  const handleOpenFollowModal = (followType?: string) => {
    if (followType === 'followers') {
      setOpenFollowerModal(true);
      getFollowers({ variables: { id: stateUser.id } });
    } else {
      setOpenFollowsToModal(true);
      getFollowing({ variables: { id: stateUser.id } });
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
        },
        fetchPolicy: 'no-cache'
      });
      setStateUser(prevState => ({
        ...prevState,
        name,
        description
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () => {
    if (token) {
      if (!stateUser.following) {
        try {
          await followUser({
            context: {
              headers: {
                authorization: `bearer ${token}`
              },
            },
            variables: {
              id: stateUser.id
            },
            fetchPolicy: 'no-cache'
          });
          setStateUser(prevState => ({
            ...prevState,
            following: true,
            followersCount: prevState.followersCount + 1
          }));
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await unfollowUser({
            context: {
              headers: {
                authorization: `bearer ${token}`
              },
            },
            variables: {
              id: stateUser.id
            },
            fetchPolicy: 'no-cache'
          });
          setStateUser(prevState => ({
            ...prevState,
            following: false,
            followersCount: prevState.followersCount - 1
          }));
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (window.confirm('You have to be logged in to follow someone, proceed to login page?')) {
        history.push('/');
      }
    }
  };

  return (
    <Box padding={2}>
      <Grid style={{ paddingBottom: '8px' }} container alignItems="baseline">
        <Grid item xs>
          <Typography noWrap variant="h6">
            {stateUser.name}
          </Typography>
          <Typography noWrap variant="body2" color="textSecondary">
            @{stateUser.username}
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
                  user={stateUser}
                  handleSubmit={handleSubmit}
                />
                <Tooltip title="Logout" aria-label="logout">
                  <IconButton onClick={logout} color="primary">
                    <ExitToApp />
                  </IconButton>
                </Tooltip>
              </> :
              <Button variant="contained" color="primary" onClick={handleFollow}>
                {stateUser.following ? 'unfollow' : 'follow'}
              </Button>
            }
          </Box>
        </Grid>
      </Grid>
      <Typography variant="body2" style={{ overflowWrap: 'break-word' }}>
        {stateUser.description}
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
              {stateUser.followersCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              followers
            </Typography>
          </Box>
        </Link>
        <Link onClick={() => handleOpenFollowModal()} color="textPrimary" style={{ cursor: 'pointer' }}>
          <Box paddingLeft={1}>
            <Typography variant="body1" color="textPrimary">
              {stateUser.followsCount}
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
};

export default UserProfile;