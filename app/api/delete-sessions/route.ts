import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    // Get the IDs of each session to be deleted
    const { ids }: { ids: number[] } = await request.json();
    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'No session IDs provided' }, { status: 400 });
    }

    // Fetch all clips for all sessions in a single query
    const { data: allClips, error: clipsError } = await supabase
      .from('clips')
      .select('id, video_url, session')
      .in('session', ids);

    if (clipsError) throw clipsError;

    console.log(`Found ${allClips.length} total clips across ${ids.length} sessions`);

    // Group clips by session for logging purposes
    const clipsBySession = allClips.reduce((acc, clip) => {
      acc[clip.session] = acc[clip.session] || [];
      acc[clip.session].push(clip);
      return acc;
    }, {} as Record<number, typeof allClips>);

    // Log clips found for each session
    ids.forEach(sessionId => {
      const sessionClips = clipsBySession[sessionId] || [];
      console.log(`Session ${sessionId}: found ${sessionClips.length} clips`);
    });

    // Prepare arrays for batch operations
    const clipIds = allClips.map(clip => clip.id);
    const fileUrls = allClips
      .filter(clip => clip.video_url)
      .map(clip => clip.video_url);

    // Execute all delete operations concurrently
    await Promise.all([
      // Delete all files from storage (if any exist)
      fileUrls.length > 0 ? (
        supabase.storage
          .from('chum-bucket')
          .remove(fileUrls)
          .then(({ data, error: storageError }) => {
            if (storageError) throw storageError;
            console.log(`Deleted ${fileUrls.length} files from storage`);
          })
      ) : Promise.resolve(),

      // Delete all clips in one operation
      clipIds.length > 0 ? (
        supabase
          .from('clips')
          .delete()
          .in('id', clipIds)
          .then(({ data, error: clipError }) => {
            if (clipError) throw clipError;
            console.log(`Deleted ${clipIds.length} clips from database`);
          })
      ) : Promise.resolve(),

      // Delete all sessions in one operation
      supabase
        .from('sessions')
        .delete()
        .in('id', ids)
        .then(({ data, error: sessionError }) => {
          if (sessionError) throw sessionError;
          console.log(`Deleted ${ids.length} sessions from database`);
        })
    ]);

    return NextResponse.json({ success: true, deletedIds: ids });

  } catch (error) {
    console.error('Error deleting sessions:', error);
    return NextResponse.json(
      { error: 'Error deleting sessions', details: error },
      { status: 500 }
    );
  }
}