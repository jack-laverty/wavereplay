import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';


export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const formData = await request.formData();
    const date = JSON.parse(formData.get('date') as string);
    const time = formData.get('time');
    const location = formData.get('location');
    const wave = formData.get('wave');
    const board = formData.get('board');

    // TODO: get this info from the user form or calculate it etc
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
      throw new Error("Route handler didn't receive any files");
    }

    // Step 2: Append UUIDs to each file name
    const filesWithUUIDs = files.map((file) => {
      if (file instanceof File) {
        // Generate a unique file name
        const uniqueFileName = `${uuidv4()}_${file.name}`;
        
        // Return a new file object with the unique name and original file properties
        return new File([file], uniqueFileName, { type: file.type });
      }
      return file;
    });

    // Step 3: Generate presigned URLs for each file
    const presignedUrls = await Promise.all(
      (filesWithUUIDs as File[]).map(async (file: File) => {
        const { data: url, error: urlError } = await supabase.storage
          .from('chum-bucket')
          .createSignedUploadUrl(`surfing/${file.name}`);
    
        if (urlError) throw urlError;
    
        return url;
      })
    );

    console.log("got presigned URLs: ", presignedUrls);

    return NextResponse.json({ 
      success: true, 
      session: session, 
      urls: presignedUrls 
    });
    

  } catch (error) {
    console.error('Error processing session and uploads:', error);
    console.error('TODO: roll back the transaction here');
    return NextResponse.json({ error: 'Error processing session and uploads', details: error }, { status: 500 });
  }
}