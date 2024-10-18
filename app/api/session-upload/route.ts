import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Video, Session } from '@/lib/types';


export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const formData = await request.formData();
    const date = JSON.parse(formData.get('date') as string);
    const time = formData.get('time');
    const location = formData.get('location');
    const wave = formData.get('wave');
    const board = formData.get('board');

    // sessionData.surfer = "Jack Laverty"
    // sessionData.wave_count = files.length

    // Step 1: Insert session data into the database
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert([
        {
          date: date,
          time: time,
          location: location,
          wave: wave,
          board: board,
        }
      ])
      .select()
      .single();

    if (sessionError) throw sessionError;

    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      throw new Error("No files were uploaded.");
    }
    
    // Step 2: Generate presigned URLs for each file
    const presignedUrls = await Promise.all(
      (files as File[]).map(async (file: File) => {
        const { data: url, error: urlError } = await supabase.storage
          .from('chum-bucket')
          .createSignedUploadUrl(`surfing/${file.name}`);
    
        if (urlError) throw urlError;
    
        return url;
      })
    );

    return NextResponse.json({ 
      success: true, 
      session: session, 
      urls: presignedUrls 
    });
    

  } catch (error) {
    console.error('Error processing session and uploads:', error);
    // If using Supabase, you might want to roll back the transaction here
    return NextResponse.json({ error: 'Error processing session and uploads', details: error }, { status: 500 });
  }
}