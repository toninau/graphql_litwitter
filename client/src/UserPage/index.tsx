import React, { useEffect, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';

import { USER_MESSAGES } from '../queries/messageQueries';
import { FETCH_USER } from '../queries/userQueries';
import { User, Message, MessageData } from '../types';
import { useStateValue } from '../state';
import storage from '../storage';

import UserProfile from './UserProfile';
import SendMessage from '../components/SendMessage';
import Messages from '../components/Messages';

import { Box, Container, createStyles, Divider, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { Message as MessageIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageIcon: {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main
    }
  }),
);

interface UserPageProps {
  user: User | null;
  username: string | undefined;
}

const UserPage: React.FC<UserPageProps> = ({ user, username }) => {
  const [token, setToken] = useStateValue();
  const client = useApolloClient();
  const { loading, data } = useQuery<{ user: User }>(
    FETCH_USER, { variables: { username: username } }
  );
  const [offset, setOffset] = useState(0);
  const [userMessages, setUserMessages] = useState<MessageData & { loading: boolean }>({
    messages: [],
    hasMore: true,
    loading: true
  });
  const classes = useStyles();

  const fetchMessage = async (offset: number) => {
    const { data, loading } = await client.query<{ messages: MessageData }>({
      query: USER_MESSAGES,
      variables: {
        username: username,
        offset
      },
      fetchPolicy: 'no-cache'
    });
    setUserMessages((prevMessages) => ({
      messages: prevMessages.messages.concat(data.messages.messages),
      hasMore: data.messages.hasMore,
      loading
    }));
  };

  // When user changes, reset offset and usermessages.
  // If user is found, fetch first messages
  useEffect(() => {
    setOffset(0);
    setUserMessages({
      messages: [],
      hasMore: true,
      loading: true,
    });
    if (data?.user) {
      void fetchMessage(0);
    }
  }, [data]);

  const addMessage = (message: Message) => {
    setUserMessages(prevUserMessages => ({
      ...prevUserMessages,
      messages: [message, ...prevUserMessages.messages]
    }));
  };

  const logout = () => {
    storage.removeToken();
    setToken('');
  };

  const getMore = () => {
    setUserMessages(prevUserMessages => ({ ...prevUserMessages, loading: true }));
    void fetchMessage(offset + 5);
    setOffset(prevOffeset => prevOffeset + 5);
  };

  if (!loading && !data?.user) {
    return (
      <p>user does not exist</p>
    );
  }

  return (
    <Container
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      maxWidth="sm"
      disableGutters>
      <Paper variant="outlined" square>
        <UserProfile
          user={data?.user}
          owner={username === user?.username}
          logout={logout}
          token={token}
        />
        <Divider variant="middle" light />
        {(username === user?.username) &&
          <SendMessage addMessage={addMessage} token={token} />
        }
        <Divider />
        <Box display="flex" justifyContent="center" alignItems="center" padding={1}>
          <MessageIcon className={classes.messageIcon} />
          <Typography variant="h6" color="primary">
            Messages
          </Typography>
        </Box>
      </Paper>
      <Messages
        messages={userMessages.messages}
        loading={userMessages.loading}
        hasMore={userMessages.hasMore}
        getMore={getMore}
      />
    </Container>
  );
};

export default UserPage;