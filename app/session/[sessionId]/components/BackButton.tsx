
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  
  const router = useRouter();
    
  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <button onClick={handleBack}>
      <img src="/navigate-back.svg" alt="Back Button" className="w-10 h-10 mr-2" />
    </button>
  );
};

export default BackButton;