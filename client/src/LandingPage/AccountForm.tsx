import React from 'react';
import { Form, Formik } from 'formik';

import { FormikTextField } from '../components/FormField';
import { AccountValues } from '../types';

import { Button, Box, CircularProgress } from '@material-ui/core';

interface AccountProps {
  handleSubmit: (values: AccountValues) => void;
  loading: boolean;
}

const AccountForm: React.FC<AccountProps> = ({ handleSubmit, loading }) => {
  return (
    <>
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
                  variant="outlined"
                  size="small"
                />
                <FormikTextField
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  size="small"
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