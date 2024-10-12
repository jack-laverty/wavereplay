import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Video, Session } from '@/lib/types';


export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const sessionData = JSON.parse(formData.get('sessionData') as string) as Session;

    sessionData.surfer = "Jack Laverty"
    sessionData.wave_count = files.length

    // add session to session table
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

    // Generate presigned URLs for each file
    const presignedUrls = files.map(async (file) => {
      const fileName = `surfing/${file}`;
      const { data: url, error: urlError } = await supabase.storage
        .from('chum-bucket')
        .createSignedUploadUrl(fileName); // valid for 2 hours
      
      if (urlError) throw urlError;
      
      return url
    });

    const presignedURLs = await Promise.all(presignedUrls);

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