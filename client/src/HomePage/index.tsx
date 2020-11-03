import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import SendMessage from './SendMessage';
import { useStateValue } from '../state';
import { SEND_MESSAGE } from '../_queries/messageQueries';

const HomePage: React.FC = () => {
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);
  const [token] = useStateValue();

  const handleSendMessage = async (message: string) => {
    console.log('send message', message);
    try {
      const data = await sendMessage({
        context: {
          headers: {
            authorization: `bearer ${token}`
          }
        },
        variables: {
          message
        }
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {token && <SendMessage handleSubmit={handleSendMessage} loading={loading} />}
      <Link to="/">back to landingpage</Link>
    </div>
  );
};

export default HomePage;