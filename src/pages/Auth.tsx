
import React from 'react';
import AuthForm from '@/components/AuthForm';
import { BrandProvider } from '@/contexts/BrandContext';

const Auth = () => {
  return (
    <BrandProvider>
      <AuthForm />
    </BrandProvider>
  );
};

export default Auth;
