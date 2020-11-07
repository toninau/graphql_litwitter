import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../queries/messageQueries';

const SendMessage: React.FC<{ token: string }> = ({ token }) => {
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);
  const [input, setInput] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.length > 0) {
      try {
        const data = await sendMessage({
          context: {
            headers: {
              authorization: `bearer ${token}`
            }
          },
          variables: {
            message: input
          }
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      setInput('');
    }
  };

  return (
    <div>
      <p>{loading ? 'sending message' : 'send message'}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={({ target }) => setInput(target.value)}></input>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default SendMessage;