
'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { getUsername } from '@/lib/supabase/user';

const BackButton = () => {
  
  const handleBack = () => {
    const username = getUsername();
    redirect(`/${username}/dashboard`);
  };

  return (
    <button onClick={handleBack}>
      <img src="/navigate-back.svg" alt="Back Button" className="w-10 h-10 mr-2" />
    </button>
  );
};

export default BackButton;