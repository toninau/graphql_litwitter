import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../queries/messageQueries';

import { InputBase, Button, Box, Paper, Divider, CircularProgress, makeStyles, Theme, createStyles } from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      alignSelf: 'flex-end',
    },
  }),
);

const SendMessage: React.FC<{ token: string }> = ({ token }) => {
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);
  const [input, setInput] = useState('');
  const classes = useStyles();

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
    <Paper variant="outlined" square>
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
            endIcon={!loading && <SendIcon />}>
            {loading ? <CircularProgress color="inherit" size={24} /> : 'send'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default SendMessage;