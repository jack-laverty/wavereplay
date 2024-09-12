'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AddSessionButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/session/form/new');
  };

  return (
    <button 
      onClick={handleClick} 
      className="w-full py-2 border-t border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex justify-center items-center"
    >
      <img
        src={"plus-symbol.svg"} 
        className="w-6 h-6"
      />
    </button>
  );
};

export default AddSessionButton;