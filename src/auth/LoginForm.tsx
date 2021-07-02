import React, { useState } from 'react';
import {
  Button, CircularProgress, Grid, TextField, Typography, Link as MuiLink,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link, useHistory } from 'react-router-dom';
import { useClient } from 'react-supabase';
import PasswordField from './PasswordField';

const LoginForm = () => {
  const client = useClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const history = useHistory();
  const login = () => {
    setLoading(true);
    return client
      .auth
      .signIn({
        email, password,
      })
      .then((response) => {
        setLoading(false);
        if (response.error) {
          return setError(response.error);
        }
        setError(null);
        return history.push('/');
      });
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Login
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form name="login">
            <Grid container spacing={2}>
              {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error.message}</Alert>
              </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="email"
                  variant="outlined"
                  label="email"
                  placeholder="alfredo.supa@getall.it"
                  fullWidth
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordField
                  name="password"
                  variant="outlined"
                  label="password"
                  disabled={loading}
                  fullWidth
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={login}
                  disabled={loading}
                  startIcon={loading && (
                  <CircularProgress
                    size={20}
                    disableShrink
                  />
                  )}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            {'Don\'t have an account? Sign up '}
            <MuiLink
              component={Link}
              to="/sign-up"
            >
              here
            </MuiLink>
            .
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginForm;
