import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Video, Session } from '@/lib/types';


export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const formData = await request.formData();
    const sessionData = JSON.parse(formData.get('sessionData') as string);

    // sessionData.surfer = "Jack Laverty"
    // sessionData.wave_count = files.length

    // Step 1: Insert session data into the database
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

    // Step 2: Extract the file names from the formData (JSON string)
    const fileNames = JSON.parse(formData.get('files') as string); // Parses the file names array
    console.log("FILENAMES: ", fileNames)

    // Step 2: Generate presigned URLs for each file
    const presignedUrls = fileNames.map(async (file: string) => {
      const { data: url, error: urlError } = await supabase.storage
        .from('chum-bucket')
        .createSignedUploadUrl(`surfing/${file}`); // valid for 2 hours
      
      if (urlError) throw urlError;
      
      return url
    });

    const presignedURLs = await Promise.all(presignedUrls);
    console.log("PRESIGNED URLS: ", presignedURLs)

    return NextResponse.json({ 
      success: true, 
      // session: session, 
      urls: presignedURLs 
    });
    

  } catch (error) {
    console.error('Error processing session and uploads:', error);
    // If using Supabase, you might want to roll back the transaction here
    return NextResponse.json({ error: 'Error processing session and uploads', details: error }, { status: 500 });
  }
}