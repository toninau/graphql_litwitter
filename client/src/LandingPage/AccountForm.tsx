import React from 'react';
import { Form, Formik } from 'formik';

import { FormikTextField } from '../components/FormField';
import { AccountValues } from '../types';

import { Button, Box, Typography, CircularProgress, Avatar } from '@material-ui/core';
import { Lock as LockIcon } from '@material-ui/icons';

interface AccountProps {
  handleSubmit: (values: AccountValues) => void;
  text: string;
  loading: boolean;
}

const AccountForm: React.FC<AccountProps> = ({ handleSubmit, text, loading }) => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        paddingBottom={3}>
        <Avatar style={{ backgroundColor: 'green' }}>
          <LockIcon />
        </Avatar>
        <Typography align="center" variant="h4">
          {text}
        </Typography>
      </Box>
      <Formik
        initialValues={{
          username: '',
          password: ''
        }}
        validate={values => {
          const requiredError = 'Field is required';
          const errors: { [field: string]: string } = {};
          if (!values.username) {
            errors.username = requiredError;
          }
          if (!values.password) {
            errors.password = requiredError;
          }
          return errors;
        }}
        onSubmit={(values) => {
          handleSubmit(values);
        }}>
        {({ isValid, dirty }) => {
          return (
            <Form>
              <Box display="flex" flexDirection="column">
                <FormikTextField
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="MrPotatio"
                  variant="outlined"
                />
                <FormikTextField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="s3cr3t"
                  variant="outlined"
                />
                <Button
                  type="submit"
                  disabled={!dirty || !isValid || loading}
                  variant="contained"
                  color="primary">
                  {loading ? <CircularProgress size={24} /> : 'submit'}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AccountForm;