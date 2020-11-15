import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/client';

import { USER_MESSAGES } from '../queries/messageQueries';
import { FETCH_USER } from '../queries/userQueries';
import { User, Message } from '../types';
import { useStateValue } from '../state';
import storage from '../storage';

import UserProfile from './UserProfile';
import SendMessage from '../components/SendMessage';
import UserMessages from './UserMessages';

import { Box, Container, createStyles, Divider, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { Message as MessageIcon } from '@material-ui/icons';

interface MessageData {
  hasMore: boolean;
  messages: Array<Message>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageIcon: {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main
    }
  }),
);

const UserPage: React.FC<{ user: User | null }> = ({ user }) => {
  const match = useRouteMatch<{ username: string }>('/u/:username');
  const [token, setToken] = useStateValue();
  const client = useApolloClient();
  const { loading, data } = useQuery<{ user: User }>(
    FETCH_USER, { variables: { username: match?.params.username } }
  );
  const [offset, setOffset] = useState(0);
  const [userMessages, setUserMessages] = useState<MessageData & { loading: boolean }>({
    messages: [],
    hasMore: true,
    loading: true
  });
  const classes = useStyles();

  useEffect(() => {
    const fetchMessage = async () => {
      const { data, loading } = await client.query<{ messages: MessageData }>({
        query: USER_MESSAGES,
        variables: {
          username: match?.params.username,
          offset
        }
      });
      setUserMessages((prevMessages) => ({
        messages: prevMessages.messages.concat(data.messages.messages),
        hasMore: data.messages.hasMore,
        loading
      }));
    };
    if (userMessages.hasMore && data?.user) {
      console.log('fetch messages');
      void fetchMessage();
    }
  }, [offset, data]);

  const logout = () => {
    storage.removeToken();
    setToken('');
  };

  const getMore = () => {
    setOffset(prevOffeset => prevOffeset + 5);
    setUserMessages(prevUserMessages => ({ ...prevUserMessages, loading: true }));
  };

  if (!loading && !data?.user) {
    return (
      <p>user does not exist</p>
    );
  }

  return (
    <Container
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      maxWidth="sm">
      <Paper variant="outlined" square>
        <UserProfile
          user={data?.user}
          owner={match?.params.username === user?.username}
          logout={logout}
          token={token}
        />
        <Divider variant="middle" light />
        {(match?.params.username === user?.username) &&
          <SendMessage token={token} />
        }
        <Divider variant="middle" light />

        <Box display="flex" justifyContent="center" alignItems="center" padding={1}>
          <MessageIcon className={classes.messageIcon} />
          <Typography variant="h6" color="primary">
            Messages
          </Typography>
        </Box>
      </Paper>
      <UserMessages
        messages={userMessages.messages}
        loading={userMessages.loading}
        hasMore={userMessages.hasMore}
        getMore={getMore}
      />
    </Container>
  );
};

export default UserPage;