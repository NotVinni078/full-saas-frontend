
import React, { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    window.location.href = '/auth';
  }, []);

  return <div>Redirecionando...</div>;
};

export default Index;
