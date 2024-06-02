'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const supabase = createClient();

export default function HamburgerMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      return;
    }
    toggleMenu(); // Close the menu after signing out
    router.push('/login');
  };

  return (
    <>
      <button onClick={toggleMenu} className="flex justify-start items-center">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white h-full shadow-lg overflow-y-auto">
            <div className="p-4 border-b">
              <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <a href="/" className="block p-2 hover:bg-gray-100 rounded transition duration-150 ease-in-out active:bg-gray-200 active:scale-95">
                    Home
                  </a>
                </li>
                <li>
                  <button 
                    onClick={handleSignOut}
                    className="w-full p-2 text-left hover:bg-gray-100 rounded transition duration-150 ease-in-out active:bg-gray-200 active:scale-95"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={toggleMenu}></div>
        </div>
      )}
    </>
  );
}
