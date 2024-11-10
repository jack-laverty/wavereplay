import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { VideoMetadata } from '@/lib/types';


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

    console.log("added session to the database:", session);

    const files = formData.getAll('files') as File[];

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
        filesWithUUIDs.map(async (file: File, index: number) => {
          const fileName = `surfing/${file.name}`;
          
          const { data: videoData, error: videoError } = await supabase
            .from('clips')
            .insert({
              session: session.id,
              title: file.name,
              video_url: fileName, // This will be updated with the actual URL after upload
              // duration: metadata?.duration,
              // width: metadata?.width,
              // height: metadata?.height,
              // format: metadata?.format,
              // file_size: metadata?.file_size,
              // resolution: metadata?.resolution,
              // created_at: metadata?.created_at,
              // updated_at: metadata?.updated_at,
              order_in_session: index + 1, // Simple ordering based on array index
            })
            .select()
            .single();

          if (videoError) throw videoError;

          return videoData;
        })
      );

      console.log(`added ${videoDataArray.length} clips to the database with the following data:`, videoDataArray);
    } catch (error) {
      console.error('Error processing videos:', error);
      throw error;
    }

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