import React from 'react';
import { Form, Formik } from 'formik';

import { FormikTextField } from '../_components/FormField';
import { AccountValues } from '../types';

import { Card, CardContent, Button, Box, Typography, CircularProgress } from '@material-ui/core';

interface AccountProps {
  handleSubmit: (values: AccountValues) => void;
  text: string;
  loading: boolean;
}

const AccountForm: React.FC<AccountProps> = ({ handleSubmit, text, loading }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {text}
        </Typography>
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
                  />
                  <FormikTextField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="s3cr3t"
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
      </CardContent>
    </Card>
  );
};

export default AccountForm;