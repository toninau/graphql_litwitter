import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import { USER_MESSAGES } from '../_queries/messageQueries';

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

const UserPage: React.FC = () => {
  const match = useRouteMatch<{ username: string }>('/u/:username');
  const client = useApolloClient();
  const [messages, setMessages] = useState<Messages[]>([]);

  const fetchMessages = async () => {
    try {
      const { data } = await client.query<MessageData>({
        query: USER_MESSAGES,
        variables: {
          username: match?.params.username
        }
      });
      console.log(data);
      setMessages(data.messages.messages);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>{match?.params.username}</p>
      <button onClick={fetchMessages}>fetch</button>
      {messages.map((message) => (
        <p key={message.id}>{JSON.stringify(message)}</p>
      ))}
    </div>
  );
};

export default UserPage;