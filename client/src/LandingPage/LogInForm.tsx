import React from 'react';
import { Form, Formik } from 'formik';

import { FormikTextField } from '../components/FormField';

import { Card, CardContent, Button, Box } from '@material-ui/core';

const LogInForm: React.FC = () => {
  return (
    <Card>
      <CardContent>
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
            console.log(values);
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
                    disabled={!dirty || !isValid}
                    variant="contained"
                    color="primary">
                    submit
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

export default LogInForm;