// app/api/videos/[videoId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .download(`surfing/${params.videoId}`);

    if (error || !data) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // convert to blob and return entire video
    const videoBlob = new Blob([data], { type: 'video/mp4' });
    const buffer = await videoBlob.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': videoBlob.size.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}