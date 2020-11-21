import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { SEND_MESSAGE } from '../queries/messageQueries';
import { Message } from '../types';

import {
  InputBase,
  Button,
  Box,
  Divider,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles
} from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';

interface SendMessageProps {
  token: string;
  addMessage: (message: Message) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1, 0), //tämä pois tai muuttaminen, kun siirretty alas
      padding: theme.spacing('6px', 3.5),
      alignSelf: 'flex-end',
    },
  }),
);

const SendMessage: React.FC<SendMessageProps> = ({ token, addMessage }) => {
  const [sendMessage, { loading }] = useMutation<{ addMessage: Message }>(SEND_MESSAGE);
  const [input, setInput] = useState('');
  const classes = useStyles();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.length > 0) {
      try {
        const { data } = await sendMessage({
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
        if (data?.addMessage) {
          addMessage(data.addMessage);
        }
      } catch (error) {
        console.log(error);
      }
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" alignItems="baseline" padding={2}>
        <InputBase
          placeholder="whats happening?"
          fullWidth
          multiline
          value={input}
          onChange={({ target }) => setInput(target.value)}
        />
        <Divider flexItem orientation="vertical" light variant="middle" />
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !input}
          endIcon={!loading && <SendIcon />}>
          {loading ? <CircularProgress color="inherit" size={24} /> : 'send'}
        </Button>
      </Box>
    </form>
  );
};

export default SendMessage;