import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { useStateValue } from '../state';
import { User, Message, MessageData } from '../types';
import { ALL_MESSAGES, FOLLOW_MESSAGES } from '../queries/messageQueries';

import SendMessage from '../components/SendMessage';
import Messages from '../components/Messages';

import {
  Box,
  Container,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';

enum TabEnum {
  AllMessages = 0,
  FollowMessages = 1
}

const HomePage: React.FC<{ user: User | null }> = ({ user }) => {
  const [token] = useStateValue();
  const client = useApolloClient();
  const [offset, setOffset] = useState(0);
  const [tab, setTab] = useState(TabEnum.AllMessages);
  const [allMessages, setAllMessages] = useState<MessageData & { loading: boolean }>({
    messages: [],
    hasMore: true,
    loading: true
  });

  useEffect(() => {
    const fetchAllMessage = async () => {
      const { data, loading } = await client.query<{ allMessages: MessageData }>({
        query: ALL_MESSAGES,
        variables: {
          offset
        },
        fetchPolicy: 'no-cache'
      });
      setAllMessages((prevMessages) => ({
        messages: prevMessages.messages.concat(data.allMessages.messages),
        hasMore: data.allMessages.hasMore,
        loading
      }));
    };
    const fetchFollowMessage = async () => {
      const { data, loading } = await client.query<{ followMessages: MessageData }>({
        query: FOLLOW_MESSAGES,
        variables: {
          offset
        },
        context: {
          headers: {
            authorization: `bearer ${token}`
          }
        },
        fetchPolicy: 'no-cache'
      });
      setAllMessages((prevMessages) => ({
        messages: prevMessages.messages.concat(data.followMessages.messages),
        hasMore: data.followMessages.hasMore,
        loading
      }));
    };
    if (allMessages.hasMore) {
      if (tab === TabEnum.AllMessages) {
        void fetchAllMessage();
      } else {
        void fetchFollowMessage();
      }
    }
  }, [offset, tab]);

  const addMessage = (message: Message) => {
    if (tab === TabEnum.AllMessages) {
      setAllMessages(prevAllMessages => ({
        ...prevAllMessages,
        messages: [message, ...prevAllMessages.messages]
      }));
    }
  };

  const getMore = () => {
    setOffset(prevOffeset => prevOffeset + 5);
    setAllMessages(prevAllMessages => ({ ...prevAllMessages, loading: true }));
  };

  const tabChange = (_event: React.ChangeEvent<unknown>, newValue: number) => {
    setOffset(0);
    setAllMessages({
      messages: [],
      hasMore: true,
      loading: true
    });
    setTab(newValue);
  };

  return (
    <Container
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      maxWidth="sm"
      disableGutters>
      <Paper variant="outlined" square>
        {(token && user) &&
          <>
            <Box padding={2}>
              <Typography noWrap variant="h6">
                {user.name}
              </Typography>
              <Typography noWrap variant="body2" color="textSecondary">
                @{user.username}
              </Typography>
            </Box>
            <Divider variant="middle" light />
            <SendMessage addMessage={addMessage} token={token} />
          </>
        }
        <Divider />
        <Tabs
          value={tab}
          onChange={tabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth">
          <Tab label="All messages" />
          {token && <Tab label="Followed messages" />}
        </Tabs>
      </Paper>
      <Messages
        messages={allMessages.messages}
        loading={allMessages.loading}
        hasMore={allMessages.hasMore}
        getMore={getMore}
      />
    </Container>
  );
};

export default HomePage;