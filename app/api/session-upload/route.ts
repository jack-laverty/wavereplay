import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Video, Session } from '@/lib/types';


// Accepts both session data and files in a single request.
// Creates the session entry in the database.
// Uploads each file to Supabase storage.
// Creates a video entry in the database for each uploaded file.
// Returns the created session and video data.
export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const sessionData = JSON.parse(formData.get('sessionData') as string) as Session;

    // Start a Supabase transaction
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert([
        {
          date: sessionData.date,
          time: sessionData.time,
          location: sessionData.location,
          wave: sessionData.wave,
          board: sessionData.board,
        }
      ])
      .select()
      .single();

      

    if (sessionError) throw sessionError;

    // Upload files and create video entries
    const uploadPromises = files.map(async (file) => {
      const fileName = `${session.id}/${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create a video entry in the database
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .insert({
          session_id: session.id,
          file_name: fileName,
          storage_path: uploadData.path,
          // Add any other relevant video metadata
        })
        .select()
        .single();

      if (videoError) throw videoError;

      return videoData;
    });

    const uploadedVideos = await Promise.all(uploadPromises);

    return NextResponse.json({ 
      success: true, 
      session: session, 
      videos: uploadedVideos 
    });

  } catch (error) {
    console.error('Error processing session and uploads:', error);
    // If using Supabase, you might want to roll back the transaction here
    return NextResponse.json({ error: 'Error processing session and uploads', details: error }, { status: 500 });
  }
}