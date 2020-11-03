import React, { useState } from 'react';

interface SendMessageProps {
  handleSubmit: (message: string) => void;
  loading: boolean;
}

const SendMessage: React.FC<SendMessageProps> = ({ handleSubmit, loading }) => {
  const [input, setInput] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(input);
    setInput('');
  };

  return (
    <div>
      <p>{loading ? 'sending message' : 'send message'}</p>
      <form onSubmit={submit}>
        <input type="text" value={input} onChange={({ target }) => setInput(target.value)}></input>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default SendMessage;