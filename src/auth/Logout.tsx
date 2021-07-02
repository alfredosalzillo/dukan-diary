import React, { useEffect } from 'react';
import { useSignOut } from 'react-supabase';

import { Redirect } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const Logout = () => {
  const [, signOut] = useSignOut();
  const { session } = useAuth();
  useEffect(() => {
    signOut();
  }, [signOut]);
  if (!session) return <Redirect to="/login" />;
  return <></>;
};

export default Logout;
