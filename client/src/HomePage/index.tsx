import React from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../state';

const HomePage: React.FC = () => {
  const [token] = useStateValue();

  return (
    <div>
      <p>{token}</p>
      <Link to="/">back to landingpage</Link>
    </div>
  );
};

export default HomePage;