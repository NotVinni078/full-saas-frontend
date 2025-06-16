
import React from 'react';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  return <AuthForm onAuth={() => window.location.href = '/inicio'} />;
};

export default Auth;
