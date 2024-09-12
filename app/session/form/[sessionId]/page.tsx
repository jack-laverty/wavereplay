'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Session } from '@/lib/types';
import MultiVideoUpload from './components/MultiVideoUpload';
import BackButton from './components/BackButton';

const SessionForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const [sessionData, setSessionData] = useState<Partial<Session>>({});

  useEffect(() => {
    if (sessionId && sessionId !== 'new') {
      // Fetch existing session data if sessionId is provided and not 'new'
      fetchSessionData(sessionId).then(setSessionData);
    }
    else {
    }
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId === 'new') {
      // Create new session
      await createSession(sessionData);
    } else {
      // Update existing session
      await updateSession(sessionId, sessionData);
    }
    router.push('/dashboard');
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center py-6 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-md w-full">
        <form className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 space-y-6" onSubmit={handleSubmit}>
          <BackButton/>
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={sessionData.date || ''}
                onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                id="time"
                type="time"
                value={sessionData.time || ''}
                onChange={(e) => setSessionData({ ...sessionData, time: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={sessionData.location || ''}
                onChange={(e) => setSessionData({ ...sessionData, location: e.target.value })}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="wave" className="block text-sm font-medium text-gray-700">
                Wave
              </label>
              <input
                id="wave"
                type="text"
                value={sessionData.wave || ''}
                onChange={(e) => setSessionData({ ...sessionData, wave: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="board" className="block text-sm font-medium text-gray-700">
                Board
              </label>
              <input
                id="board"
                type="text"
                value={sessionData.board || ''}
                onChange={(e) => setSessionData({ ...sessionData, board: e.target.value })}
                className="form-input"
              />
            </div>
            
            {/* Add other form fields as needed */}
          </div>

          <MultiVideoUpload />

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-100 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
}

export default SessionForm;

// These functions would need to be implemented
async function fetchSessionData(sessionId: string): Promise<Session> {
  // Implement fetching session data
  throw new Error('Not implemented');
}

async function createSession(sessionData: Partial<Session>): Promise<void> {
  // Implement creating a new session
  throw new Error('Not implemented');
}

async function updateSession(sessionId: string, sessionData: Partial<Session>): Promise<void> {
  // Implement updating an existing session
  throw new Error('Not implemented');
}