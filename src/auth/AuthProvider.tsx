import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useAuthStateChange, useClient } from 'react-supabase';
import { Session, User } from '@supabase/supabase-js';

export type AuthState = {
  session?: Session,
  user?: User,
};
const initialState: AuthState = {
  session: null,
  user: null,
};
export const AuthContext = createContext(initialState);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC = ({ children }) => {
  const client = useClient();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const session = client.auth.session();
    setState({ session, user: session?.user ?? null });
  }, []);

  useAuthStateChange((event, session) => {
    console.log(`Supabase auth event: ${event}`, session);
    setState({ session, user: session?.user ?? null });
  });

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
