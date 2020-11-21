import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { useStateValue } from '../state';
import { User, Message, MessageData } from '../types';
import { ALL_MESSAGES } from '../queries/messageQueries';

import SendMessage from '../components/SendMessage';
import Messages from '../components/Messages';

import { Box, Container, createStyles, Divider, makeStyles, Paper, Theme, Typography, } from '@material-ui/core';
import { Message as MessageIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageIcon: {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main
    }
  }),
);

const HomePage: React.FC<{ user: User | null }> = ({ user }) => {
  const [token] = useStateValue();
  const client = useApolloClient();
  const [offset, setOffset] = useState(0);
  const [allMessages, setAllMessages] = useState<MessageData & { loading: boolean }>({
    messages: [],
    hasMore: true,
    loading: true
  });
  const classes = useStyles();

  useEffect(() => {
    const fetchMessage = async () => {
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
    if (allMessages.hasMore) {
      void fetchMessage();
    }
  }, [offset]);

  const addMessage = (message: Message) => {
    setAllMessages(prevAllMessages => ({
      ...prevAllMessages,
      messages: [message, ...prevAllMessages.messages]
    }));
  };

  const getMore = () => {
    setOffset(prevOffeset => prevOffeset + 5);
    setAllMessages(prevAllMessages => ({ ...prevAllMessages, loading: true }));
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
        <Divider variant="middle" light />

        <Box display="flex" justifyContent="center" alignItems="center" padding={1}>
          <MessageIcon className={classes.messageIcon} />
          <Typography variant="h6" color="primary">
            All messages
          </Typography>
        </Box>
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