import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@material-ui/core';
import React from 'react';

interface FollowListUserProps {
  user: {
    username: string;
    name: string;
  };
  goToUser: (username: string) => void
}

const FollowListUser: React.FC<FollowListUserProps> = ({ user, goToUser }) => {
  return (
    <>
      <ListItem alignItems="flex-start" button onClick={() => goToUser(user.username)}>
        <ListItemAvatar>
          <Avatar>
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
      <Divider variant="fullWidth" component="li" />
    </>
  );
};

export default FollowListUser;