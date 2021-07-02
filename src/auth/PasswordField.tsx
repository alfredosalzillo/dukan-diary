import {
  IconButton, InputAdornment, TextField, TextFieldProps,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@material-ui/icons';

export type PasswordFieldProps = Exclude<TextFieldProps, 'type'>;

const PasswordField: React.FC<PasswordFieldProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      {...props}
      type={!showPassword ? 'password' : 'text'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
