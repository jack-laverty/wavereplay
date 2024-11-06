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

    console.log("successfully made entry in session table, response:", session);
    console.log("new session id:", session.id);

    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      console.log("Route handler didn't receive any files")
      return NextResponse.json({ error: "Route handler didn't receive any files" }, { status: 400 });
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

    // Step 4: Add database entries for video files
    try {
      const videoDataArray = await Promise.all(
        files.map(async (file) => {
          const fileName = `surfing/${Date.now()}_${file}`;
          const { data: videoData, error: videoError } = await supabase
            .from('videos')
            .insert({
              session_id: session.id,
              file_name: fileName,
              // add path to file
              // Add any other relevant video metadata
            })
            .select()
            .single();

          if (videoError) throw videoError;

          return videoData;
        })
      );

      console.log('All video entries added:', videoDataArray);
    } catch (error) {
      console.error('Error adding video entries:', error);
    }

    return NextResponse.json({ 
      success: false, 
      session: null, 
      urls: [] 
    });

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