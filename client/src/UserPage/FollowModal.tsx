import React from 'react';

import { FollowsTo, Follower } from '../types';

import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  DialogContent,
  List,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

interface FollowModalProps {
  open: boolean;
  handleClose: () => void;
  loading: boolean;
  followers?: Array<Follower>;
  following?: Array<FollowsTo>;
  text: string;
}

const FollowModal: React.FC<FollowModalProps> = ({ open, handleClose, loading, followers, following, text }) => {

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {text}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading ?
          <CircularProgress /> :
          followers ? (
            (followers && followers.length > 0) ?
              <List>
                {followers.map((value) => (
                  <ListUser key={value.follower.id} user={value.follower} />
                ))}
              </List> :
              <p>no followers</p>
          ) : (
            (following && following.length > 0) ?
              <List>
                {following.map((value) => (
                  <ListUser key={value.followsTo.id} user={value.followsTo} />
                ))}
              </List> :
              <p>no following</p>
          )}
      </DialogContent>
    </Dialog>
  );
};

const ListUser: React.FC<{ user: { username: string, name: string } }> = ({ user }) => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            style={{ textDecoration: 'none' }}>
            {user.username.substring(0, 1).toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={user.username}
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {user.name}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export default FollowModal;