import React from 'react';
import { Link } from 'react-router-dom';

import SendMessage from '../components/SendMessage';
import { useStateValue } from '../state';

const HomePage: React.FC = () => {
  const [token] = useStateValue();

  return (
    <div>
      {token && <SendMessage token={token} />}
      <p>users messages</p>
      <Link to="/">back to landingpage</Link>
    </div>
  );
};

export default HomePage;