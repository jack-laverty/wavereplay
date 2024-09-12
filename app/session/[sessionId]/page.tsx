
import React from 'react';
import SessionHeader from "./components/SessionHeader";
import VideoWrapper from './components/VideoWrapper';
import { Session, Video } from '@/lib/types'
import { createClient } from '@/lib/supabase/server'

async function getSession(id: string): Promise<Session | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', id)
    .single(); // Expect a single row

  if (error) {
      console.error('Error fetching session:', error);
      return null;
  }

  return data;
}

async function getClips(id: string): Promise<Video[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('session_id', id); // we expect multiple

  if (error) {
      console.error('Error fetching clips:', error);
      return null;
  }

  return data;
}

export default async function SessionPage({ params }: { params: { sessionId: string } }) {

  // retrieve the session information
  const session = await getSession(params.sessionId);
  if (!session) {
    return <div>No session data available</div>;
  }

  // retrieve clips based on session ID
  const clips = await getClips(params.sessionId);
  if (!clips) {
    return <div>No clips assigned to this session</div>;
  }
  
  return (
    <div className='session-page'>
      <SessionHeader session={session}/>
      {/* <Link href={`/session/form/${sessionId}`}>Modify Session</Link> */}
      <div className="flex flex-col justify-between py-4 bg-gray-100">
        <VideoWrapper clips={clips} session={session}/>
      </div>
    </div>
  );
};