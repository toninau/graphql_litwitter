import React from 'react';

interface HelloProps {
  name: string;
}

const Hello: React.FC<HelloProps> = ({ name }) => {
  return (
    <p>hello {name}</p>
  );
};

export default Hello;