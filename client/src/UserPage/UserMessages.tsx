import React from 'react';

import { Message as MessageType } from '../types';
import Message from '../components/Message';
import SkeletonMessage from '../components/SkeletonMessage';

import { Button, List, Paper, Typography } from '@material-ui/core';

interface UserMessagesProps {
  messages: Array<MessageType>;
  loading: boolean;
  hasMore: boolean;
  getMore: () => void;
}

const UserMessages: React.FC<UserMessagesProps> = ({ messages, loading, hasMore, getMore }) => {
  return (
    <div style={{ padding: '2em 0' }}>
      <Paper variant="outlined" square>
        <List disablePadding>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </List>
        {(messages && loading) &&
          Array(5).fill(0).map((_value, index) => (
            <SkeletonMessage key={index} />
          ))
        }
        {hasMore ?
          <Button
            fullWidth
            onClick={getMore}
            variant="contained"
            color="primary">
            get more messages
          </Button> :
          <Typography style={{ padding: '2em' }} align="center" variant="body1">
            no more messages :(
          </Typography>
        }
      </Paper>
    </div>
  );
};

export default UserMessages;