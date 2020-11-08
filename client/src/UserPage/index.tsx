import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/client';

import { USER_MESSAGES } from '../queries/messageQueries';
import { FETCH_USER } from '../queries/userQueries';
import { User } from '../types';
import { useStateValue } from '../state';
import storage from '../storage';

import SendMessage from '../components/SendMessage';

import { Box, Button } from '@material-ui/core';

interface MessageData {
  hasMore: boolean;
  messages: Array<{
    id: number;
    text: string;
    user: {
      username: string;
    }
  }>;
}

const UserPage: React.FC<{ user: User | null }> = ({ user }) => {
  const match = useRouteMatch<{ username: string }>('/u/:username');
  const [token, setToken] = useStateValue();
  const client = useApolloClient();
  const { loading, data } = useQuery<{ user: User }>(
    FETCH_USER, { variables: { username: match?.params.username } }
  );
  const [offset, setOffset] = useState(0);
  const [{ messages, hasMore }, setUserMessages] = useState<MessageData>({
    messages: [],
    hasMore: true
  });

  useEffect(() => {
    const fetchMessage = async () => {
      const { data } = await client.query<{ messages: MessageData }>({
        query: USER_MESSAGES,
        variables: {
          username: match?.params.username,
          offset
        }
      });
      setUserMessages((prevMessages) => ({
        messages: prevMessages.messages.concat(data.messages.messages),
        hasMore: data.messages.hasMore
      }));
    };
    if (hasMore && data?.user) {
      console.log('fetch messages');
      void fetchMessage();
    }
  }, [offset, data]);

  const logout = () => {
    storage.removeToken();
    setToken('');
  };

  if (loading) {
    return (
      <p>loading...</p>
    );
  }
  if (!loading && !data?.user) {
    return (
      <p>user does not exist</p>
    );
  }
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
      {(match?.params.username === user?.username) &&
        <Box>
          <SendMessage token={token} />
          <Button onClick={logout}>logout</Button>
        </Box>
      }
      {messages.map((message) => (
        <p key={message.id}>{JSON.stringify(message)}</p>
      ))}
      {hasMore &&
        <button onClick={() => setOffset(prevOffset => prevOffset + 5)}>get more messages</button>
      }
    </div>
  );
};

export default UserPage;