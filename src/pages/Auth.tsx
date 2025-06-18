
import React from 'react';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  return (
    <div className="min-h-screen brand-background flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <AuthForm onAuth={() => window.location.href = '/inicio'} />
      </div>
    </div>
  );
};

export default Auth;
