import React from 'react';
import { useHistory } from 'react-router-dom';

import { FollowsTo, Follower } from '../types';
import FollowListUser from './FollowListUser';

import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  DialogContent,
  List,
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
  const history = useHistory();

  const goToUser = (username: string) => {
    handleClose();
    history.push(`/u/${username}`);
  };

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
                  <FollowListUser key={value.follower.id} user={value.follower} goToUser={goToUser} />
                ))}
              </List> :
              <p>no followers</p>
          ) : (
            (following && following.length > 0) ?
              <List>
                {following.map((value) => (
                  <FollowListUser key={value.followsTo.id} user={value.followsTo} goToUser={goToUser} />
                ))}
              </List> :
              <p>no following</p>
          )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;