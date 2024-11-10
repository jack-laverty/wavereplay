import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const supabase = createClient();

    // Get video from Supabase with surfing/ prefix
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .download(`surfing/${params.videoId}`);

    if (error || !data) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Convert the data to a Blob with proper type
    const videoBlob = new Blob([data], { type: 'video/mp4' });
    const buffer = await videoBlob.arrayBuffer();

    // Return simple response if no range request
    if (!request.headers.get('range')) {
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': videoBlob.size.toString(),
          'Accept-Ranges': 'bytes',
        },
      });
    }

    // Handle range request
    const range = request.headers.get('range')!;
    const start = parseInt(range.replace(/bytes=/, '').split('-')[0]);
    const end = Math.min(start + 1000000, videoBlob.size - 1); // Stream in 1MB chunks
    const chunk = buffer.slice(start, end + 1);

    return new NextResponse(chunk, {
      status: 206,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes ${start}-${end}/${videoBlob.size}`,
        'Content-Length': `${end - start + 1}`,
        'Accept-Ranges': 'bytes',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}