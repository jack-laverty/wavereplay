import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  
  try {

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .download("surfing/" + params.videoId);

    if (error) {
        console.error('Catch all Error streaming video:', error);
        return NextResponse.json({ error: 'Error streaming video' }, { status: 500 });
    }
    
    if (!data) {
      console.error('No data returned from Supabase');
      return NextResponse.json({ error: 'No data returned from storage' }, { status: 404 });
    }

    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : data.size - 1;
      const chunkSize = (end - start) + 1;

      return new NextResponse(data.slice(start, end + 1), {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${data.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    } else {
      return new NextResponse(data, {
        status: 200,
        headers: {
          'Content-Length': data.size.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    }
  } catch (error) {
    console.error('Catch all Error streaming video:', error);
    return NextResponse.json({ error: 'Error streaming video', details: error }, { status: 500 });
  }
}