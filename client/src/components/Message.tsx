import React from 'react';
import { Link } from 'react-router-dom';

import { Message as MessageType } from '../types';

import {
  Avatar,
  Grid,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core';

const Message: React.FC<{ message: MessageType }> = ({ message }) => {
  const dateString = new Intl
    .DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(Date.parse(message.createdAt));

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            style={{ textDecoration: 'none' }}
            component={Link}
            to={`/u/${message.user.username}`}>
            {message.user.username.substring(0, 1).toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Grid container alignItems="center">
              <Grid item style={{ paddingRight: '4px' }}>
                <Typography variant="body1">
                  {message.user.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  @{message.user.username} · {dateString}
                </Typography>
              </Grid>
            </Grid>
          }
          secondary={
            <Typography
              style={{ overflowWrap: 'break-word' }}
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