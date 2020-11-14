import React from 'react';

import { Message as MessageType } from '../types';

import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core';

const Message: React.FC<{ message: MessageType }> = ({ message }) => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar>
            {message.user.username.substring(0, 1).toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={message.user.username}
          secondary={
            <Typography
              variant="body2"
              color="textPrimary">
              {message.text}
            </Typography>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export default Message;