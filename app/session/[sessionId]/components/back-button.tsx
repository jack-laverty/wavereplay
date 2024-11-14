'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getUsername } from '@/lib/supabase/user';
import { CircleArrowLeft } from 'lucide-react'

const BackButton: React.FC = () => {

  const router = useRouter();

  const handleBack = async () => {
      const username = await getUsername();
      if (!username) {
        router.push('/login')
        return;
      }
      router.push(`/${username}/dashboard`);
    };

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleBack}
    >
      <CircleArrowLeft />
    </Button>
  );
};

export default BackButton;
