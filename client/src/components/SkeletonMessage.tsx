import React from 'react';

import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const SkeletonMessage: React.FC = () => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Skeleton variant="circle">
            <Avatar />
          </Skeleton>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Skeleton variant="text" width={40} />
          }
          secondary={
            <Skeleton variant="text" width="100%" />
          }
        />
      </ListItem>
      <Divider variant="inset" />
    </>
  );
};

export default SkeletonMessage;