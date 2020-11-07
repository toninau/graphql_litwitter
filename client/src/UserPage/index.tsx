import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import { USER_MESSAGES } from '../queries/messageQueries';
import { User } from '../types';
import { useStateValue } from '../state';
import storage from '../storage';

import SendMessage from '../components/SendMessage';

import { Box, Button } from '@material-ui/core';

type Messages = {
  id: number;
  text: string;
  user: {
    username: string;
  }
};

interface MessageData {
  messages: {
    hasMore: boolean;
    messages: Messages[];
  };
  loading: boolean;
}

const UserPage: React.FC<{ user: User | null }> = ({ user }) => {
  const match = useRouteMatch<{ username: string }>('/u/:username');
  const client = useApolloClient();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [token, setToken] = useStateValue();

  //haettava userin tiedot fetchUser

  // tämän korjaaminen, näyttää aikaisemman tuloksen (ei hae uutta)
  const fetchMessages = async () => {
    try {
      const { data } = await client.query<MessageData>({
        query: USER_MESSAGES,
        variables: {
          username: match?.params.username,
          offset: 0
        }
      });
      console.log(data);
      setMessages(data.messages.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    storage.removeToken();
    setToken('');
  };

  return (
    <div>
      <p>{match?.params.username}</p>
      {(match?.params.username === user?.username) &&
        <Box>
          <SendMessage token={token} />
          <Button onClick={logout}>logout</Button>
        </Box>
      }
      <button onClick={fetchMessages}>fetch</button>
      {messages.map((message) => (
        <p key={message.id}>{JSON.stringify(message)}</p>
      ))}
    </div>
  );
};

export default UserPage;