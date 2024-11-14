
import React from 'react';
import SessionHeader from "./components/session-header";
import VideoWrapper from './components/video-wrapper';
import { Session, VideoMetadata } from '@/lib/types'
import { createClient } from '@/lib/supabase/server'
import { Textarea } from "@/components/ui/textarea"


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
    <div className="session-page pt-4">
      <SessionHeader session={session} />
      <div className="flex py-4 bg-gray-100 mx-4 gap-4">
        {/* Video player container */}
        <div className="flex-1">
          {clips.length === 0 ? (
            <div>No clips assigned to this session</div>
          ) : (
            <VideoWrapper clips={clips} session={session} />
          )}
        </div>
        
        <div className="w-60 bg-white p-4 rounded-lg">
          <h2 className="text-sm pb-2">Comments</h2>
          <Textarea placeholder="Add a comment..." />
        </div>
      </div>
    </div>
  );
};