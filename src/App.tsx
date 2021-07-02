import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { Provider as SupabaseProvider } from 'react-supabase';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  AuthProvider, LoginForm, Logout, SignupForm, useAuth,
} from './auth';
import Page from './layout/Page';
import Home from './routes/Home';
import AddUserLog from './routes/AddUserLog';

const {
  REACT_APP_SUPABASE_URL = '',
  REACT_APP_SUPABASE_SECRET = '',
} = process.env;
const client = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_SECRET);

const App = () => {
  const { session } = useAuth();
  return (
    <SupabaseProvider value={client}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AuthProvider>
          <BrowserRouter>
            <QueryParamProvider ReactRouterRoute={Route}>
              <Switch>
                <Route path="/sign-up">
                  <Page maxWidth="xs" contentJustify="space-between">
                    <SignupForm />
                  </Page>
                </Route>
                <Route path="/login">
                  <Page maxWidth="xs" contentJustify="space-between">
                    <LoginForm />
                  </Page>
                </Route>
                <Route path="/logout">
                  <Logout />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
                {session && (<Redirect to="/" />)}
                {!session && (<Redirect to="/login" />)}
              </Switch>
              <Route path="/">
                <AddUserLog />
              </Route>
            </QueryParamProvider>
          </BrowserRouter>
        </AuthProvider>
      </MuiPickersUtilsProvider>
    </SupabaseProvider>
  );
};

export default App;
