import React from 'react';
import { Form, Formik } from 'formik';

import { User } from '../types';
import { FormikTextField } from '../components/FormField';

import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

interface UserModalProps {
  open: boolean;
  handleOpen: () => void;
  user: User;
  handleSubmit: (name: string, description: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({ open, handleOpen, user, handleSubmit }) => {
  return (
    <Dialog open={open} onClose={handleOpen} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Edit profile
          </Typography>
          <IconButton onClick={handleOpen}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={{
            name: user.name || '',
            description: user.description || '',
          }}
          validate={values => {
            const errors: { [field: string]: string } = {};
            if (values.name.length > 14) {
              errors.name = 'Name is too long';
            }
            if (values.description.length > 280) {
              errors.description = 'Description is too long';
            }
            return errors;
          }}
          onSubmit={({ name, description }) => {
            handleSubmit(name, description);
          }}>
          {({ isValid, dirty }) => {
            return (
              <Form>
                <Box display="flex" flexDirection="column">
                  <FormikTextField
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Add your name"
                  />
                  <FormikTextField
                    label="Description"
                    name="description"
                    type="text"
                    placeholder="Tell about yourself"
                    multiline
                    rows={4}
                  />
                  <Button
                    style={{ margin: '1em 0' }}
                    type="submit"
                    onClick={handleOpen}
                    disabled={!dirty || !isValid}
                    color="primary"
                    variant="outlined">
                    submit
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;