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
  createStyles,
  Typography
} from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';

interface SendMessageProps {
  token: string;
  addMessage: (message: Message) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(0, 1),
      padding: theme.spacing('6px', 3.5),
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
      <div>
        <div style={{ margin: '16px' }}>
          <InputBase
            placeholder="What's happening?"
            fullWidth
            multiline
            value={input}
            onChange={({ target }) => setInput(target.value)}
          />
        </div>
        <Divider light variant="middle" />
        <Box display="flex" justifyContent="flex-end" padding={1} alignItems="center">
          <Typography variant="body2" color={input.length > 280 ? 'error' : 'textPrimary'}>
            {input.length}/280
          </Typography>
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !input || input.length > 280}
            endIcon={!loading && <SendIcon />}>
            {loading ? <CircularProgress color="inherit" size={24} /> : 'send'}
          </Button>
        </Box>
      </div>
    </form>
  );
};

export default SendMessage;