import React from 'react';
import { useRouteMatch } from 'react-router-dom';

const UserPage: React.FC = () => {
  const data = useRouteMatch<{ username: string }>('/u/:username');

  return (
    <div>
      <p>{data?.params.username}</p>
      <p>User page</p>
    </div>
  );
};

export default UserPage;