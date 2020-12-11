import React, { useEffect, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';

import { USER_MESSAGES } from '../queries/messageQueries';
import { FETCH_USER } from '../queries/userQueries';
import { User, Message, MessageData, UserWithExtra } from '../types';
import { useStateValue } from '../state';
import storage from '../storage';

import UserProfile from './UserProfile';
import UserProfileSkeleton from './UserProfileSkeleton';
import SendMessage from '../components/SendMessage';
import Messages from '../components/Messages';

import { Container, Divider, Paper, Tabs, Tab } from '@material-ui/core';

interface UserPageProps {
  user: User | null;
  username: string | undefined;
}

const UserPage: React.FC<UserPageProps> = ({ user, username }) => {
  const [token, setToken] = useStateValue();
  const client = useApolloClient();
  const { loading, data } = useQuery<{ user: UserWithExtra }>(FETCH_USER, {
    variables: { username: username },
    context: {
      headers: {
        authorization: `bearer ${token}`
      }
    },
    fetchPolicy: 'no-cache'
  });
  const [offset, setOffset] = useState(0);
  const [userMessages, setUserMessages] = useState<MessageData & { loading: boolean }>({
    messages: [],
    hasMore: true,
    loading: true
  });

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
        {(!loading && data?.user) ?
          <UserProfile
            user={data.user}
            owner={username === user?.username}
            logout={logout}
            token={token}
          /> :
          <UserProfileSkeleton />
        }
        <Divider variant="middle" light />
        {(username === user?.username) &&
          <SendMessage addMessage={addMessage} token={token} />
        }
        <Divider />
        <Tabs
          value={0}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth">
          <Tab label="messages" />
        </Tabs>
      </Paper>
      <Messages
        messages={!loading ? userMessages.messages : []}
        loading={loading || userMessages.loading}
        hasMore={userMessages.hasMore}
        getMore={getMore}
      />
    </Container>
  );
};

export default UserPage;