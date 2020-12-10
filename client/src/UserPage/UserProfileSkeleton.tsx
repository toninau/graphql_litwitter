import React from 'react';

import { Box, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const UserProfileSkeleton: React.FC = () => {
  return (
    <Box padding={2}>
      <Typography noWrap variant="h6">
        <Skeleton width={100} />
      </Typography>
      <Typography noWrap variant="body2">
        <Skeleton width={50} />
      </Typography>
      <Typography variant="body2">
        <Skeleton width={350} />
      </Typography>
      <Box display="flex" alignItems="center" paddingTop={1}>
        <Typography variant="body2">
          <Skeleton width={120} />
        </Typography>
      </Box>
    </Box>
  );
};

export default UserProfileSkeleton;