import { useField } from 'formik';
import React from 'react';

import {
  TextField,
} from '@material-ui/core';

interface TextProps {
  label: string;
  type: 'text' | 'password';
  name: string;
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  multiline?: boolean;
  rows?: number;
}

export const FormikTextField: React.FC<TextProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.touched && meta.error ? meta.error : '';

  return (
    <TextField
      {...field}
      {...props}
      label={label}
      error={!!errorText}
      helperText={errorText}
      style={{ minHeight: '5rem' }}
    />
  );
};