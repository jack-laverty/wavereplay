
import React from 'react';
import SessionHeader from "./components/session-header";
import VideoWrapper from './components/video-wrapper';
import { Session, VideoMetadata } from '@/lib/types'
import { createClient } from '@/lib/supabase/server'

async function getSession(id: string): Promise<Session | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single(); // Expect a single row

  if (error) {
      console.error('Error fetching session:', error);
      return null;
  }

  return data;
}

async function getClips(id: string): Promise<VideoMetadata[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('session', id); // we expect multiple
    
  if (error) {
      console.error('Error fetching clips:', error);
      return [];
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
  
  return (
    <div className="session-page">
      <SessionHeader session={session} />
      <div className="flex flex-col justify-between py-4 bg-gray-100">
        {clips.length === 0 ? (
          <div>No clips assigned to this session</div>
        ) : (
          <VideoWrapper clips={clips} session={session} />
        )}
      </div>
    </div>
  );
};