import React from 'react';

import { Message as MessageType } from '../types';
import Message from './Message';
import SkeletonMessage from './SkeletonMessage';

import { Button, List, Paper, Typography } from '@material-ui/core';

interface MessagesProps {
  messages: Array<MessageType>;
  loading: boolean;
  hasMore: boolean;
  getMore: () => void;
}

const Messages: React.FC<MessagesProps> = ({ messages, loading, hasMore, getMore }) => {
  return (
    <Paper style={{ flexGrow: 1 }} variant="outlined" square>
      <List disablePadding>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {(messages && loading) &&
          Array(15).fill(0).map((_value, index) => (
            <SkeletonMessage key={index} />
          ))
        }
      </List>
      {(hasMore && !loading) &&
        <Button
          onClick={getMore}
          color="primary"
          style={{ display: 'block', margin: '1em auto' }}>
          get more messages
        </Button>
      }
      {!hasMore &&
        <Typography style={{ padding: '1em' }} align="center" variant="body1">
          {messages.length ? 'no more messages :(' : 'no messages :/'}
        </Typography>
      }
    </Paper>
  );
};

export default Messages;